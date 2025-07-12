import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import type { ActionMetadata } from "@/types/config-types";
import { handleApiError } from "@/errors/error-handler";
import { fetchRates, prettifyRates } from "../../services/rates.service";

export default async function GET(c: Context<AppBindings>) {
  try {
    return prettifyRates(await fetchRates(c));
  }
  catch (error) {
    handleApiError(error);
  }
}

export const metadata: ActionMetadata = {
  endpoint: "get/fees",
  method: "GET",
};
