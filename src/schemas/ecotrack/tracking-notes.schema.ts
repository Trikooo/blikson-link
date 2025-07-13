import { z } from "zod";

export const normalizedEcotrackCreateTrackingNoteSchema = z.object({
  trackingNumber: z.string().trim().min(1).max(100),
  trackingNote: z.string().trim().min(1).max(255),
});
export type NormalizedEcotrackCreateTrackingNote = z.infer<typeof normalizedEcotrackCreateTrackingNoteSchema>;
