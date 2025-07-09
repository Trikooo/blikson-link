import { z } from "zod";
import { wilayaCodeSchema } from "@/schemas/shared.schemas";

// Request query params
export const ecotrackGetCommunesQueryParamsSchema = z.object({
  wilaya_id: wilayaCodeSchema.optional(),
});

// Single commune entry
export const ecotrackCommuneSchema = z.object({
  nom: z.string(),
  wilaya_id: wilayaCodeSchema,
  code_postal: z.string(),
  has_stop_desk: z.union([z.literal(0), z.literal(1)]),
});

// Success response (record with numeric string keys) or array of communes if wilayaId is specified
export const ecotrackGetCommunesResponseSuccessSchema = z.union([
  z.record(
    z.string().regex(/^\d+$/), // keys like "1", "2", ...
    ecotrackCommuneSchema,
  ),
  z.array(ecotrackCommuneSchema),
]);
// Error response
export const ecotrackGetCommunesResponseErrorSchema = z.object({
  message: z.string(),
});

// Final union schema
export const ecotrackGetCommunesResponseSchema = z.union([
  ecotrackGetCommunesResponseSuccessSchema,
  ecotrackGetCommunesResponseErrorSchema,
]);

// Inferred types
export type EcotrackGetCommunesQueryParams = z.infer<
  typeof ecotrackGetCommunesQueryParamsSchema
>;

export type EcotrackCommune = z.infer<typeof ecotrackCommuneSchema>;

export type EcotrackGetCommunesResponseSuccess = z.infer<
  typeof ecotrackGetCommunesResponseSuccessSchema
>;

export type EcotrackGetCommunesResponseError = z.infer<
  typeof ecotrackGetCommunesResponseErrorSchema
>;

export type EcotrackGetCommunesResponse = z.infer<
  typeof ecotrackGetCommunesResponseSchema
>;
