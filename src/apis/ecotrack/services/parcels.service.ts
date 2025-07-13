import type { Context } from "hono";
import type { NormalizedEcotrackParcel } from "@/schemas/ecotrack/parcels.schema";
import type { AppBindings } from "@/types/api-types";
import type { RawEcotrackParcel } from "@/types/providers/ecotrack/create-parcel.types";
import axios, { isAxiosError } from "axios";
import { ZodError } from "zod";
import { UnexpectedResponseError } from "@/errors/api-errors";
import { ecotrackCreateParcelResponseSuccessSchema, ecotrackCreateParcelResponseValidationErrorSchema } from "@/types/providers/ecotrack/create-parcel.types";
import { ecotrackGetRatesSuccessResponseSchema } from "@/types/providers/ecotrack/get-rates.types";
import { buildUrl } from "@/utils/build-url";
import client from "@/utils/request";
import { metadata as actionMetadata } from "../models/rates/get";
import { constructHeaders, normalizeAlgerianPhone } from "../utils";

export async function createParcels(
  c: Context<AppBindings>,
  requestData: NormalizedEcotrackParcel,
) {
  try {
    const { baseUrl } = c.get("companyMetadata");
    const ecotrackHeaders = constructHeaders(c);
    const shippingPrice = requestData.shippingPrice || await fetchShippingPrice(baseUrl, requestData, ecotrackHeaders);
    const ecotrackPayload = toEcotrackPayload(requestData, shippingPrice);
    const { data } = await client.post(buildUrl(c), ecotrackPayload, {
      headers: ecotrackHeaders,
    });

    let parsedData;
    try {
      parsedData = ecotrackCreateParcelResponseSuccessSchema.parse(data);
    }
    catch (error) {
      throw new UnexpectedResponseError(error);
    }
    if (parsedData.success) {
      return { ...requestData, shippingPrice, trackingNumber: parsedData.tracking };
    }

    if (parsedData.message === "Module de stockage désactivé") {
      throw new ZodError([
        {
          code: "custom",
          message: "Store not eligible for stock",
          path: ["fromStock"],
        },
      ]);
    }
  }
  catch (error) {
    if (isAxiosError(error)) {
      const result = ecotrackCreateParcelResponseValidationErrorSchema.safeParse(error.response?.data);

      if (result.success) {
        const parsed = result.data;
        console.error("parsed: ", parsed);
        if (parsed.errors.commune?.length) {
          throw new ZodError([
            {
              code: "custom",
              message: "Invalid commune",
              path: ["commune"],
            },
          ]);
        }
      }
    }

    throw error;
  }
}

function toEcotrackPayload(requestData: NormalizedEcotrackParcel, shippingPrice: number): RawEcotrackParcel {
  const ecotrackOperationMap = {
    delivery: 1,
    exchange: 2,
    pickup: 3,
    recovery: 4,
  } as const;

  return {
    reference: requestData.id,
    nom_client: requestData.name,
    telephone: normalizeAlgerianPhone(requestData.phoneNumber),
    telephone_2: requestData.phoneNumberAlt ? normalizeAlgerianPhone(requestData.phoneNumberAlt) : undefined,
    adresse: requestData.address,
    code_postal: requestData.postalCode,
    commune: requestData.commune,
    code_wilaya: requestData.wilayaId,
    montant: requestData.productValue + shippingPrice,
    remarque: requestData.notes,
    produit: requestData.productName,
    stock: requestData.fromStock ? 1 : 0,
    quantite: requestData.quantity,
    produit_a_recuperer: requestData.productToCollect,
    boutique: requestData.shopName,
    type: ecotrackOperationMap[requestData.operationType],
    stop_desk: requestData.isStopDesk ? 1 : 0,
    weight: requestData.weight,
    fragile: requestData.isFragile,
  };
}

export async function fetchShippingPrice(
  baseUrl: string,
  requestData: NormalizedEcotrackParcel,
  ecotrackHeaders: any,
) {
  try {
    const { endpoint } = actionMetadata;
    const url = `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

    const { data } = await client.get(url, { headers: ecotrackHeaders });

    // Fix Ecotrack typo before parsing
    if ("echnage" in data) {
      data.echange = data.echnage;
      delete data.echnage;
    }

    const parsedData = ecotrackGetRatesSuccessResponseSchema.parse(data);

    const operationTypeMap = {
      delivery: "livraison",
      pickup: "pickup",
      exchange: "echange",
      recovery: "recouvrement",
    } as const;

    const t = operationTypeMap[requestData.operationType];

    const wilayaPrices = parsedData[t]?.find(
      ({ wilaya_id }) => wilaya_id === requestData.wilayaId,
    );

    if (!wilayaPrices) {
      throw new Error(`No prices for wilayaId: ${requestData.wilayaId}`);
    }

    const shippingPrice = requestData.isStopDesk
      ? wilayaPrices.tarif_stopdesk
      : wilayaPrices.tarif;

    return Number(shippingPrice);
  }
  catch (err) {
    if (axios.isAxiosError(err)) {
      throw err;
    }

    throw new UnexpectedResponseError(err, "Failed to fetch Ecotrack shipping price");
  }
}
