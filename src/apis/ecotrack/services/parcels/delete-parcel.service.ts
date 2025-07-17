import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import { NotFoundError } from "@/errors/api-errors";
import { buildUrl } from "@/utils/build-url";
import client from "@/utils/request";
import { constructHeaders, resolveTrackingNumber } from "../../utils";

export async function deleteParcel(c: Context<AppBindings>, trackingNumber?: string, endpoint?: string) {
  trackingNumber = resolveTrackingNumber(c, trackingNumber);
  const { baseUrl } = c.get("companyMetadata");
  const url = `${endpoint ? buildUrl(baseUrl, endpoint) : buildUrl(c)}?tracking=${trackingNumber}`;
  const { data } = await client.delete(url, { headers: constructHeaders(c) });
  if (data.delete === "success" || data.success) {
    return { trackingNumber };
  }
  // throw a not found error when ecotrack returns {"delete": "fail"} with 200 OK 💀
  throw new NotFoundError("Parcel not found", data);
}
