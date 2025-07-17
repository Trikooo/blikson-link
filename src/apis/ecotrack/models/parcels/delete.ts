import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import type { ActionMetadata } from "@/types/config-types";
import { handleApiError } from "@/errors/error-handler";
import { deleteParcel } from "../../services/parcels/delete-parcel.service";

export default async function DELETE(c: Context<AppBindings>) {
  try {
    return await deleteParcel(c);
  }
  catch (error) {
    console.error("hello");
    handleApiError(error);
  }
}

export const metadata: ActionMetadata = { endpoint: "delete/order", method: "DELETE" };
