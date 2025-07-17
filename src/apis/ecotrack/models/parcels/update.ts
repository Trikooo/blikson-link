import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import type { ActionMetadata } from "@/types/config-types";
import { handleApiError } from "@/errors/error-handler";
import { normalizedEcotrackParcelUpdateSchema } from "@/schemas/ecotrack/parcels.schema";
import { updateParcel } from "../../services/parcels/update-parcel.service";

export default async function UPDATE(c: Context<AppBindings>) {
  try {
    const data = normalizedEcotrackParcelUpdateSchema.parse(await c.req.json());
    return await updateParcel(c, data);
  }
  catch (error) {
    handleApiError(error);
  }
}

export const metadata: ActionMetadata = {
  endpoint: "update/order",
  method: "PATCH",
};
