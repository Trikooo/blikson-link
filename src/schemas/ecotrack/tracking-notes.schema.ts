import { z } from "zod";

export const normalizedEcotrackCreateTrackingNoteSchema = z.object({
  trackingNote: z.string().trim().min(1).max(255),
});
export type NormalizedEcotrackCreateTrackingNote = z.infer<typeof normalizedEcotrackCreateTrackingNoteSchema>;
