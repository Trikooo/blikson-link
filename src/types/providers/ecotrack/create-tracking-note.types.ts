import { z } from "zod";

// Request schema
export const ecotrackCreateTrackingNoteRequestSchema = z.object({
  tracking: z.string().trim().min(1).max(100),
  content: z.string().trim().min(1).max(255),
});

// Success response schema
export const ecotrackCreateTrackingNoteResponseSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

// Error response schema
export const ecotrackCreateTrackingNoteResponseErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.array(z.string())),
});

// Combined response schema
export const ecotrackCreateTrackingNoteResponseSchema = z.union([
  ecotrackCreateTrackingNoteResponseSuccessSchema,
  ecotrackCreateTrackingNoteResponseErrorSchema,
]);

// Inferred types
export type EcotrackCreateTrackingNoteRequest = z.infer<typeof ecotrackCreateTrackingNoteRequestSchema>;
export type EcotrackCreateTrackingNoteResponseSuccess = z.infer<typeof ecotrackCreateTrackingNoteResponseSuccessSchema>;
export type EcotrackCreateTrackingNoteResponseError = z.infer<typeof ecotrackCreateTrackingNoteResponseErrorSchema>;
export type EcotrackCreateTrackingNoteResponse = z.infer<typeof ecotrackCreateTrackingNoteResponseSchema>;
