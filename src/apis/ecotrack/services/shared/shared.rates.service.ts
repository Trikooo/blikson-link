import type { NormalizedEcotrackParcel, NormalizedEcotrackParcelUpdate } from "@/schemas/ecotrack/parcels.schema";
import { metadata as actionMetadata } from "@ecotrack/models/rates/get";
import axios from "axios";
import { UnexpectedResponseError } from "@/errors/api-errors";
import { ecotrackGetRatesSuccessResponseSchema } from "@/types/providers/ecotrack/get-rates.types";
import client from "@/utils/request";

export async function fetchShippingPrice(
  baseUrl: string,
  requestData: NormalizedEcotrackParcel | NormalizedEcotrackParcelUpdate,
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
  catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }

    throw new UnexpectedResponseError(error);
  }
}

/**
 * Updates shippingPrice in place for a single parcel or an array of parcels.
 * Accepts NormalizedEcotrackParcel | NormalizedEcotrackParcelUpdate | NormalizedEcotrackParcel[]
 * or NormalizedEcotrackParcelUpdate[].
 */
export async function updateShippingPricesInPlace(
  baseUrl: string,
  parcels: NormalizedEcotrackParcel | NormalizedEcotrackParcelUpdate | NormalizedEcotrackParcel[] | NormalizedEcotrackParcelUpdate[],
  ecotrackHeaders: any,
) {
  if (Array.isArray(parcels)) {
    for (const parcel of parcels) {
      parcel.shippingPrice = typeof parcel.shippingPrice === "number" ? parcel.shippingPrice : await fetchShippingPrice(baseUrl, parcel, ecotrackHeaders);
    }
  }
  else {
    parcels.shippingPrice = typeof parcels.shippingPrice === "number" ? parcels.shippingPrice : await fetchShippingPrice(baseUrl, parcels, ecotrackHeaders);
  }
}
