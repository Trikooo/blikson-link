import type { Context } from "hono";
import type { DesksResponse } from "@/schemas/ecotrack/desks.schema";
import type { AppBindings } from "@/types/api-types";
import type {
  EcotrackGetCommunesQueryParams,
  EcotrackGetCommunesResponseSuccess,
} from "@/types/providers/ecotrack/get-communes.types";
import { constructHeaders } from "@ecotrack/utils";
import { UnexpectedResponseError } from "@/errors/api-errors";
import { getDesksQuerySchema } from "@/schemas/ecotrack/desks.schema";
import {
  ecotrackGetCommunesResponseSuccessSchema,
} from "@/types/providers/ecotrack/get-communes.types";
import { buildUrl } from "@/utils/build-url";
import client from "@/utils/request";

/**
 * Fetches the list of communes from the Ecotrack API for the current company.
 *
 * @param c - Hono request context (must include "company" in context).
 * @returns The raw response containing communes.
 */
export async function fetchCommunes(c: Context<AppBindings>) {
  const { data } = await client.get(buildUrl(c), {
    headers: constructHeaders(c),
    params: constructParams(c),
  });
  try {
    const parsedData = ecotrackGetCommunesResponseSuccessSchema.parse(data);
    return parsedData;
  }
  catch (error) {
    throw new UnexpectedResponseError(error);
  }
}

/**
 * Filters and groups communes with stop desks by wilaya.
 *
 * @param data - Raw communes data.
 * @returns Communes grouped by wilaya ID.
 */
export function prettifyDesks(
  data: EcotrackGetCommunesResponseSuccess,
): DesksResponse {
  const prettyDesks: DesksResponse["desks"] = {};
  const stopDeskCommunes = Object.values(data).filter(
    commune => commune.has_stop_desk === 1,
  );

  for (const { wilaya_id, code_postal, nom } of stopDeskCommunes) {
    if (!prettyDesks[wilaya_id]) {
      prettyDesks[wilaya_id] = [];
    }
    prettyDesks[wilaya_id].push({
      name: nom,
      postalCode: code_postal,
    });
  }
  return { desks: prettyDesks };
}

export function constructParams(
  c: Context<AppBindings>,
): EcotrackGetCommunesQueryParams {
  const parseResult = getDesksQuerySchema.parse({
    wilayaId: c.req.query("wilayaId"),
  });

  const params: EcotrackGetCommunesQueryParams = {
    wilaya_id: parseResult.wilayaId,
  };
  return params;
}
