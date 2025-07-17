import type { Context } from "hono";
import type { NormalizedEcotrackShipParcel } from "@/schemas/ecotrack/parcels.schema";
import type { AppBindings } from "@/types/api-types";
import { isAxiosError } from "axios";
import { ZodError } from "zod";
import { NotFoundError } from "@/errors/api-errors";
import { buildUrl } from "@/utils/build-url";
import client from "@/utils/request";
import { constructHeaders, resolveTrackingNumber } from "../../utils";

export async function shipParcel(c: Context<AppBindings>, requestData: NormalizedEcotrackShipParcel, endpoint?: string, trackingNumber?: string) {
  try {
    trackingNumber = resolveTrackingNumber(c, trackingNumber);
    const { baseUrl } = c.get("companyMetadata");
    const url = endpoint ? buildUrl(baseUrl, endpoint) : buildUrl(c);
    const ecotrackHeaders = constructHeaders(c);
    const ecotrackPayload = toEcotrackPayload(trackingNumber, requestData);
    const { data } = await client.post(url, ecotrackPayload, { headers: ecotrackHeaders });
    if (data.success) {
      return { trackingNumber };
    }
    throw new ZodError([{
      code: "custom",
      message: "Cannot ship this parcel",
      path: ["trackingNumber"],
    }]);
  }
  catch (error) {
    if (isAxiosError(error) && error.response?.data?.errors) {
      const errors = error.response.data.errors;
      if (errors.tracking && errors.tracking.length) {
        throw new NotFoundError("Parcel not found");
      }
      throw error;
    }
  }
}

function toEcotrackPayload(trackingNumber: string, requestData: NormalizedEcotrackShipParcel) {
  return {
    tracking: trackingNumber,
    ask_collection: requestData.requestPickup,
  };
}
