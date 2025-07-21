import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import type { ActionMetadata } from "@/types/config-types";
import { createBulkParcels } from "@/apis/ecotrack/services/parcels/create-parcel.service";
import { handleApiError } from "@/errors/error-handler";
import { normalizedEcotrackParcelSchema } from "@/schemas/ecotrack/parcels.schema";

export const bulkParcelSchema = normalizedEcotrackParcelSchema.array().min(1);

export default async function CREATE(c: Context<AppBindings>) {
  try {
    const raw = await c.req.json();
    const parcels = bulkParcelSchema.parse(raw);
    const result = await createBulkParcels(c, parcels);
    // Set status on context
    if (result.success === true) {
      c.status(201);
    }
    else if (result.success === false) {
      c.status(422);
    }
    else {
      c.status(200); // partial success
    }
    // Do not include statusCode in the response
    const { statusCode, ...response } = result;
    return response;
  }
  catch (error) {
    handleApiError(error);
  }
}

export const metadata: ActionMetadata = {
  endpoint: "create/orders",
  method: "POST",
};
