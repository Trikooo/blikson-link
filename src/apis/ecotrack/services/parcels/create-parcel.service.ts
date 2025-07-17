import type { Context } from "hono";
import type { NormalizedEcotrackParcel } from "@/schemas/ecotrack/parcels.schema";
import type { AppBindings } from "@/types/api-types";
import type { RawEcotrackParcel } from "@/types/providers/ecotrack/create-parcel.types";
import { metadata as actionMetadata } from "@ecotrack/models/parcels/update";
import { isAxiosError } from "axios";
import { ZodError } from "zod";
import { UnexpectedResponseError } from "@/errors/api-errors";
import { getErrorMessage } from "@/errors/error-handler";
import { ecotrackCreateParcelResponseSuccessSchema, ecotrackCreateParcelResponseValidationErrorSchema } from "@/types/providers/ecotrack/create-parcel.types";
import { buildUrl } from "@/utils/build-url";
import client from "@/utils/request";
import { constructHeaders, ecotrackOperationMap, normalizeAlgerianPhone } from "../../utils";
import { fetchShippingPrice } from "../shared/shared.rates.service";
import { updateParcel } from "./update-parcel.service";

export async function createParcels(
  c: Context<AppBindings>,
  requestData: NormalizedEcotrackParcel,
) {
  try {
    const { baseUrl } = c.get("companyMetadata");
    const ecotrackHeaders = constructHeaders(c);
    const shippingPrice = typeof requestData.shippingPrice === "number" ? requestData.shippingPrice : await fetchShippingPrice(baseUrl, requestData, ecotrackHeaders);
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
      requestData = { ...requestData, shippingPrice };
      const { gpsLink } = requestData;
      let gpsLinkUpdateError;
      if (gpsLink) {
        gpsLinkUpdateError = await tryUpdateParcelWithGpsLink(c, requestData, actionMetadata.endpoint, parsedData.tracking);
        console.error("gpsLinkUpdateError: ", gpsLinkUpdateError);
      }
      return {
        trackingNumber: parsedData.tracking,
        ...requestData,
        gpsLink: gpsLinkUpdateError ? undefined : requestData.gpsLink,
        shippingPrice,
        error: gpsLinkUpdateError,
      };
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
    boutique: requestData.storeName,
    type: ecotrackOperationMap[requestData.operationType],
    stop_desk: requestData.isStopDesk ? 1 : 0,
    weight: requestData.weight,
    fragile: requestData.isFragile,
  };
}

async function tryUpdateParcelWithGpsLink(c: Context<AppBindings>, requestData: NormalizedEcotrackParcel, endpoint: string, trackingNumber: string) {
  try {
    await updateParcel(c, requestData, endpoint, trackingNumber);
    return null;
  }
  catch (error) {
    return getErrorMessage(error);
  }
}
