import { Context } from "hono";
import {
  fetchCommunes,
  prettifyDesks,
} from "@/apis/ecotrack/services/desks.service";
import { AppBindings } from "@/types/api-types";
import { handleApiError } from "@/errors/error-handler";

/**
 * Fetches communes with stop desks for the current company from the Ecotrack API.
 *
 * @async
 * @function
 * @param  c - Hono request context, extended with <AppBindings>.
 * @returns  Resolves to an array of communes that have a stop desk.
 * @throws  Throws 500 error if the request fails or an unexpected error occurs.
 */
export default async function GET(c: Context<AppBindings>) {
  try {
    const data = await fetchCommunes(c);
    const result = prettifyDesks(data);
    return result;
  } catch (error) {
    handleApiError(error);
  }
}
