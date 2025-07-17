import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import type { ActionMetadata } from "@/types/config-types";
import { handleApiError } from "@/errors/error-handler";
import { normalizedEcotrackShipParcelSchema } from "@/schemas/ecotrack/parcels.schema";
import { shipParcel } from "../../services/parcels/ship-parcel.service";

export default async function SHIP(c: Context<AppBindings>) {
  try {
    const data = normalizedEcotrackShipParcelSchema.parse(await c.req.json());
    return await shipParcel(c, data);
  }
  catch (error) {
    handleApiError(error);
  }
}

export const metadata: ActionMetadata = {
  endpoint: "valid/order",
  method: "PATCH",
};
