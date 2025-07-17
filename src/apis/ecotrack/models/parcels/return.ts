import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import type { ActionMetadata } from "@/types/config-types";
import { handleApiError } from "@/errors/error-handler";
import { returnParcel } from "../../services/parcels/return-parcels.service";

export default async function RETURN(c: Context<AppBindings>) {
  try {
    return await returnParcel(c);
  }
  catch (error) {
    handleApiError(error);
  }
}

export const metadata: ActionMetadata = {
  endpoint: "ask/for/order/return",
  method: "PATCH",
};
