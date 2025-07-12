import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import type { ActionMetadata } from "@/types/config-types";
import { createParcels } from "@/apis/ecotrack/services/parcels.service";
import { handleApiError } from "@/errors/error-handler";
import { normalizedEcotrackParcelSchema } from "@/schemas/ecotrack/parcels.schema";

export default async function CREATE(c: Context<AppBindings>) {
  try {
    const data = normalizedEcotrackParcelSchema.parse(await c.req.json());
    return await createParcels(c, data);
  }
  catch (error) {
    handleApiError(error);
  }
}

export const metadata: ActionMetadata = {
  endpoint: "create/order",
  method: "POST",
};
