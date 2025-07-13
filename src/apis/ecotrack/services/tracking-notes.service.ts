import type { Context } from "hono";
import type { NormalizedEcotrackCreateTrackingNote } from "@/schemas/ecotrack/tracking-notes.schema";
import type { AppBindings } from "@/types/api-types";
import { AxiosError } from "axios";
import { ZodError } from "zod"; // for throwing a zod-like error
import { UnexpectedResponseError } from "@/errors/api-errors";
import { ecotrackCreateTrackingNoteResponseSuccessSchema } from "@/types/providers/ecotrack/create-tracking-note.types";
import { buildUrl } from "@/utils/build-url";
import client from "@/utils/request";
import { constructHeaders } from "../utils";

export async function createTrackingNote(
  c: Context<AppBindings>,
  requestData: NormalizedEcotrackCreateTrackingNote,
) {
  try {
    const { data } = await client.post(
      buildUrl(c),
      {
        tracking: requestData.trackingNumber,
        content: requestData.trackingNote,
      },
      {
        headers: constructHeaders(c),
      },
    );

    try {
      ecotrackCreateTrackingNoteResponseSuccessSchema.parse(data);
      return { trackingNote: requestData.trackingNote };
    }
    catch (error) {
      throw new UnexpectedResponseError(error);
    }
  }
  catch (error) {
    if (error instanceof AxiosError) {
      const trackingErrors = error.response?.data?.errors?.tracking;
      if (Array.isArray(trackingErrors)) {
        throw new ZodError([
          {
            path: ["trackingNumber"],
            message: "Invalid trackingNumber",
            code: "custom",
          },
        ]);
      }
    }
    throw error;
  }
}
