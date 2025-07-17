import type { Context } from "hono";
import type { ZodIssue } from "zod";
import type { NormalizedEcotrackParcelUpdate } from "@/schemas/ecotrack/parcels.schema";
import type { AppBindings } from "@/types/api-types";
import type { EcotrackUpdateParcelRequest } from "@/types/providers/ecotrack/update-parcel.types";
import { isAxiosError } from "axios";
import { ZodError } from "zod";
import { NotFoundError, UnexpectedResponseError } from "@/errors/api-errors";
import { ecotrackUpdateParcelResponseError, ecotrackUpdateParcelResponseSuccess } from "@/types/providers/ecotrack/update-parcel.types";
import { buildUrl } from "@/utils/build-url";
import client from "@/utils/request";
import { constructHeaders, ecotrackOperationMap, normalizeAlgerianPhone } from "../../utils";
import { fetchShippingPrice } from "../shared/shared.rates.service";

export async function updateParcel(c: Context<AppBindings>, requestData: NormalizedEcotrackParcelUpdate, endpoint?: string, trackingNumber?: string) {
  try {
    const { baseUrl } = c.get("companyMetadata");
    const url = endpoint ? buildUrl(baseUrl, endpoint) : buildUrl(c);
    if (!trackingNumber) {
      trackingNumber = c.req.param("id");
    }
    const ecotrackHeaders = constructHeaders(c);
    const shippingPrice = typeof requestData.shippingPrice === "number" ? requestData.shippingPrice : await fetchShippingPrice(baseUrl, requestData, ecotrackHeaders);
    const ecotrackPayload = toEcotrackPayload(requestData, shippingPrice, trackingNumber);
    const { data } = await client.post(url, ecotrackPayload, {
      headers: ecotrackHeaders,
    });
    try {
      ecotrackUpdateParcelResponseSuccess.parse(data);
      return { ...requestData, shippingPrice };
    }
    catch (error) {
      throw new UnexpectedResponseError(error);
    }
  }
  catch (error) {
    if (isAxiosError(error)) {
      const result = ecotrackUpdateParcelResponseError.safeParse(error.response?.data);

      if (result.success) {
        const parsed = result.data;
        const errorFields = ["commune", "tracking"];
        const issues: ZodIssue[] = [];
        let hasTrackingError = false;
        for (const errorField of errorFields) {
          if (parsed.errors[errorField]?.length) {
            if (errorField === "tracking") {
              hasTrackingError = true;
            }
            else if (errorField === "commune") {
              issues.push({
                code: "custom",
                message: "Invalid commune",
                path: ["commune"],
              });
            }
          }
        }
        if (hasTrackingError) {
          throw new NotFoundError("Parcel not found");
        }
        if (issues.length) {
          throw new ZodError(issues);
        }
      }
    }

    throw error;
  }
}

function toEcotrackPayload(requestData: NormalizedEcotrackParcelUpdate, shippingPrice: number, trackingNumber: string): EcotrackUpdateParcelRequest {
  return {
    tracking: trackingNumber,
    reference: requestData.id,
    client: requestData.name,
    tel: normalizeAlgerianPhone(requestData.phoneNumber),
    tel2: requestData.phoneNumberAlt ? normalizeAlgerianPhone(requestData.phoneNumberAlt) : undefined,
    adresse: requestData.address,
    code_postal: requestData.postalCode,
    commune: requestData.commune,
    wilaya: requestData.wilayaId,
    montant: requestData.productValue + shippingPrice,
    remarque: requestData.notes,
    product: requestData.productName,
    boutique: requestData.storeName,
    type: ecotrackOperationMap[requestData.operationType],
    stop_desk: requestData.isStopDesk ? 1 : 0,
    fragile: requestData.isFragile ? 1 : 0,
    gps_link: requestData.gpsLink,
    weight: requestData.weight,
  };
}
