import type { Context } from "hono";
import type { NormalizedEcotrackCreateTrackingNote } from "@/schemas/ecotrack/tracking-notes.schema";
import type { AppBindings } from "@/types/api-types";
import { AxiosError } from "axios";
import { ZodError } from "zod";
import { UnexpectedResponseError } from "@/errors/api-errors";
import { ecotrackCreateTrackingNoteResponseSuccessSchema } from "@/types/providers/ecotrack/create-tracking-note.types";
import { buildUrl } from "@/utils/build-url";
import client from "@/utils/request";
import { constructHeaders } from "../utils";

export async function createTrackingNote(
  c: Context<AppBindings>,
  requestData: Omit<NormalizedEcotrackCreateTrackingNote, "trackingNumber">,
) {
  const trackingNumber = c.req.param("id");

  if (!trackingNumber) {
    throw new ZodError([
      {
        path: ["trackingNumber"],
        message: "Missing tracking number in URL",
        code: "custom",
      },
    ]);
  }

  try {
    const { data } = await client.post(
      buildUrl(c),
      {
        tracking: trackingNumber,
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
            message: "Invalid tracking number",
            code: "custom",
          },
        ]);
      }
    }
    throw error;
  }
}
