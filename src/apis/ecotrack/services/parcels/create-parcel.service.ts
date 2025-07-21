import type { Context } from "hono";
import type { NormalizedEcotrackParcel } from "@/schemas/ecotrack/parcels.schema";
import type { AppBindings } from "@/types/api-types";
import type { RawEcotrackParcel } from "@/types/providers/ecotrack/create-parcel.types";
import { isAxiosError } from "axios";
import { ZodError } from "zod";
import { UnexpectedResponseError } from "@/errors/api-errors";
import { ecotrackCreateParcelResponseSuccessSchema, ecotrackCreateParcelResponseValidationErrorSchema } from "@/types/providers/ecotrack/create-parcel.types";
import { buildUrl } from "@/utils/build-url";
import client from "@/utils/request";
import { constructHeaders, ecotrackOperationMap, normalizeAlgerianPhone } from "../../utils";
import { updateShippingPricesInPlace } from "../shared/shared.rates.service";

export async function createParcels(
  c: Context<AppBindings>,
  requestData: NormalizedEcotrackParcel,
) {
  try {
    const { baseUrl } = c.get("companyMetadata");
    const ecotrackHeaders = constructHeaders(c);
    if (typeof requestData.shippingPrice !== "number") {
      await updateShippingPricesInPlace(baseUrl, requestData, ecotrackHeaders);
    }
    const ecotrackPayload = toEcotrackPayload(requestData);
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
      return {
        trackingNumber: parsedData.tracking,
        ...requestData,
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

/**
 * Bulk create Ecotrack parcels with robust error handling and response normalization.
 */
export async function createBulkParcels(
  c: Context<AppBindings>,
  parcels: NormalizedEcotrackParcel[],
) {
  const { baseUrl } = c.get("companyMetadata");
  const ecotrackHeaders = constructHeaders(c);
  await updateShippingPricesInPlace(baseUrl, parcels, ecotrackHeaders);

  // Build Ecotrack payload using the new toEcotrackPayload
  const ecotrackPayload = toEcotrackPayload(parcels);

  const response = await client.post(
    buildUrl(c),
    { orders: ecotrackPayload },
    { headers: ecotrackHeaders },
  );
  const resultsData = response.data?.results;
  const results: any[] = [];
  let successCount = 0;
  let failCount = 0;

  parcels.forEach((parcel, idx) => {
    const key = parcel.id!;
    console.error("key: ", key);
    const result = resultsData[key];
    if (!result) {
      results.push({
        code: "VALIDATION_ERROR",
        message: "Unknown error",
        path: [idx],
      });
      failCount++;
      return;
    }
    // Commune error
    if (result.errors) {
      results.push({
        code: "VALIDATION_ERROR",
        message: "Invalid commune",
        path: [idx, "commune"],
      });
      failCount++;
      return;
    }
    // Stock not allowed
    if (result.success === false && result.message === "Module de stockage désactivé") {
      results.push({
        code: "VALIDATION_ERROR",
        message: "Store not eligible for stock",
        path: [idx, "fromStock"],
      });
      failCount++;
      return;
    }
    // Success
    if (result.success === true) {
      results.push({
        trackingNumber: result.tracking,
        ...parcel,
      });
      successCount++;
      return;
    }
    // Unknown error
    results.push({
      code: "VALIDATION_ERROR",
      message: "Unknown error",
      path: [idx],
    });
    failCount++;
  });

  let success: true | false | "partial" = true;
  let statusCode: number = 200;
  if (successCount === 0) {
    success = false;
    statusCode = 422;
  }
  else if (failCount > 0) {
    success = "partial";
    statusCode = 200;
  }

  // Add summary
  const summary = {
    total: parcels.length,
    succeeded: successCount,
    failed: failCount,
  };

  /**
   * Note: This function does not handle or send HTTP responses directly.
   * It returns a statusCode property for the caller to use when sending the response.
   * Server errors (exceptions) are not handled here and should be caught by the caller.
   */
  return { results, success, summary, statusCode };
}

function toEcotrackPayload(
  parcels: NormalizedEcotrackParcel[] | NormalizedEcotrackParcel,
): Record<string, RawEcotrackParcel> | RawEcotrackParcel {
  function generateId(): string {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `BLIK-${suffix}`;
  }

  function mapParcel(parcel: NormalizedEcotrackParcel): RawEcotrackParcel {
    if (!parcel.id)
      parcel.id = generateId(); // assign in-place
    return {
      reference: parcel.id,
      nom_client: parcel.name,
      telephone: normalizeAlgerianPhone(parcel.phoneNumber),
      telephone_2: parcel.phoneNumberAlt ? normalizeAlgerianPhone(parcel.phoneNumberAlt) : undefined,
      adresse: parcel.address,
      code_postal: parcel.postalCode,
      commune: parcel.commune,
      code_wilaya: parcel.wilayaId,
      montant: parcel.productValue + (parcel.shippingPrice || 0),
      remarque: parcel.notes,
      produit: parcel.productName,
      stock: parcel.fromStock ? 1 : 0,
      quantite: parcel.quantity,
      produit_a_recuperer: parcel.productToCollect,
      boutique: parcel.storeName,
      type: ecotrackOperationMap[parcel.operationType],
      stop_desk: parcel.isStopDesk ? 1 : 0,
      weight: parcel.weight,
      fragile: parcel.isFragile ? 1 : 0,
      gps_link: parcel.gpsLink,
    };
  }

  if (Array.isArray(parcels)) {
    const payload: Record<string, RawEcotrackParcel> = {};
    parcels.forEach((parcel) => {
      if (!parcel.id)
        parcel.id = generateId(); // ensure parcel.id is present before keying
      payload[parcel.id] = mapParcel(parcel);
    });
    return payload;
  }
  else {
    if (!parcels.id)
      parcels.id = generateId(); // ensure single parcel has an ID
    return mapParcel(parcels);
  }
}
