import { z } from "zod";

// Rate entry for a single wilaya
export const ecotrackRateEntrySchema = z.object({
  wilaya_id: z.number(),
  tarif: z.string(),
  tarif_stopdesk: z.string(),
});

// Success response structure
export const ecotrackGetRatesSuccessResponseSchema = z.object({
  livraison: z.array(ecotrackRateEntrySchema),
  pickup: z.array(ecotrackRateEntrySchema),
  echange: z.array(ecotrackRateEntrySchema),
  recouvrement: z.array(ecotrackRateEntrySchema),
  retours: z.array(ecotrackRateEntrySchema),
});

// Error response structure
export const ecotrackGetRatesErrorResponseSchema = z.object({
  message: z.string(),
});

// Final union schema
export const ecotrackGetRatesResponseSchema = z.union([
  ecotrackGetRatesSuccessResponseSchema,
  ecotrackGetRatesErrorResponseSchema,
]);

// Inferred types
export type EcotrackRateEntry = z.infer<typeof ecotrackRateEntrySchema>;
export type EcotrackGetRatesSuccessResponse = z.infer<typeof ecotrackGetRatesSuccessResponseSchema>;
export type EcotrackGetRatesErrorResponse = z.infer<typeof ecotrackGetRatesErrorResponseSchema>;
export type EcotrackGetRatesResponse = z.infer<typeof ecotrackGetRatesResponseSchema>;
