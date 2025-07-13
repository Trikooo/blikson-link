import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import type { ActionMetadata } from "@/types/config-types";
import { createTrackingNote } from "@/apis/ecotrack/services/tracking-notes.service";
import { handleApiError } from "@/errors/error-handler";
import { normalizedEcotrackCreateTrackingNoteSchema } from "@/schemas/ecotrack/tracking-notes.schema";

export default async function TRACKING_NOTE(c: Context<AppBindings>) {
  try {
    const data = normalizedEcotrackCreateTrackingNoteSchema.parse(await c.req.json());
    return await createTrackingNote(c, data);
  }
  catch (error) {
    handleApiError(error);
  }
}

export const metadata: ActionMetadata = {
  endpoint: "add/maj",
  method: "POST",
};
