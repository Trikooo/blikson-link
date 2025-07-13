import type { Context } from "hono";
import type { PrettifiedRates } from "@/schemas/ecotrack/rates.schemas";
import type { AppBindings } from "@/types/api-types";
import type { EcotrackGetRatesSuccessResponse } from "@/types/providers/ecotrack/get-rates.types";
import { WILAYAS } from "@/constants/wilayas";
import { UnexpectedResponseError } from "@/errors/api-errors";
import { ecotrackGetRatesSuccessResponseSchema } from "@/types/providers/ecotrack/get-rates.types";
import { buildUrl } from "@/utils/build-url";
import client from "@/utils/request";
import { constructHeaders } from "../utils";

export async function fetchRates(c: Context<AppBindings>) {
  const { data } = await client.get(buildUrl(c), {
    headers: constructHeaders(c),
  });
  if ("echnage" in data) {
    data.echange = data.echnage;
    delete data.echnage;
  }
  try {
    return ecotrackGetRatesSuccessResponseSchema.parse(data);
  }

  catch (error) {
    throw new UnexpectedResponseError(error);
  }
}

export function prettifyRates(
  rawRates: EcotrackGetRatesSuccessResponse,
): PrettifiedRates {
  // Mapping from French keys to English camelCase
  const operationTypeMap: Record<string, string> = {
    livraison: "delivery",
    pickup: "pickup",
    echange: "exchange",
    recouvrement: "recovery",
    retours: "returns",
  };

  const result: Record<string, any> = {};

  // For each rate type (French key)
  for (const [frType, entries] of Object.entries(rawRates)) {
    const enType = operationTypeMap[frType] || frType;
    for (const entry of entries) {
      const wilayaId = String(entry.wilaya_id);
      if (!result[wilayaId]) {
        result[wilayaId] = {
          name: WILAYAS[Number(wilayaId) - 1].name || "",
        };
      }
      result[wilayaId][enType] = {
        home: Number(entry.tarif),
        stopDesk: Number(entry.tarif_stopdesk),
      };
    }
  }

  return { rates: result };
}
