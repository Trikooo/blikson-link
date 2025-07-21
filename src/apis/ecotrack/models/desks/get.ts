import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import {
  fetchCommunes,
  prettifyDesks,
} from "@/apis/ecotrack/services/desks.service";
import { handleApiError } from "@/errors/error-handler";

/**
 * Fetches communes with stop desks for the current company from the Ecotrack API.
 *
 * @async
 * @function
 * @param  c - Hono request context, extended with <AppBindings>.
 * @returns  Resolves to an array of communes that have a stop desk.
 * @throws  Throws the appropriate status code if the request fails.
 */
export default async function GET(c: Context<AppBindings>) {
  try {
    return { payload: prettifyDesks(await fetchCommunes(c)) };
  }
  catch (error) {
    handleApiError(error);
  }
}

export const metadata = {
  endpoint: "get/communes",
  method: "GET",
};
