import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import axios from "axios";
import { ZodError } from "zod";
import { NotFoundError } from "@/errors/api-errors";
import { buildUrl } from "@/utils/build-url";
import client from "@/utils/request";
import { constructHeaders, resolveTrackingNumber } from "../../utils";

export async function returnParcel(c: Context<AppBindings>, endpoint?: string, trackingNumber?: string) {
  try {
    trackingNumber = resolveTrackingNumber(c, trackingNumber);
    const { baseUrl } = c.get("companyMetadata");
    const url = `${endpoint ? buildUrl(baseUrl, endpoint) : buildUrl(c)}?tracking=${trackingNumber}`;
    const { data } = await client.post(url, undefined, { headers: constructHeaders(c) });
    console.error("HERE");

    if (data.success) {
      return { trackingNumber };
    }

    throw new ZodError([
      {
        code: "custom",
        message: "Can't return this parcel",
        path: ["trackingNumber"],
      },
    ]);
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      const resData = error.response?.data;
      const trackingError
        = resData?.errors?.tracking?.includes("Le champ tracking sélectionné est invalide.");

      if (trackingError) {
        throw new NotFoundError("Parcel not found", resData);
      }
    }

    throw error;
  }
}
