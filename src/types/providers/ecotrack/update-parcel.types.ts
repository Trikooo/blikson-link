import { z } from "zod";

// --- Request Schema ---
export const ecotrackUpdateParcelSchema = z.object({
  tracking: z.string().min(1),
  reference: z.string().max(255).optional(),
  client: z.string().max(255),
  tel: z.string().min(9).max(10),
  tel2: z.string().min(9).max(10).optional(),
  adresse: z.string().max(255),
  code_postal: z.string().optional(),
  commune: z.string().max(255),
  wilaya: z.number().int().min(1).max(58),
  montant: z.number().positive(),
  remarque: z.string().max(255).optional(),
  product: z.string().max(255).optional(),
  boutique: z.string().max(255).optional(),
  type: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  stop_desk: z.union([z.literal(0), z.literal(1)]).optional(),
  fragile: z.union([z.literal(0), z.literal(1)]).optional(),
  gps_link: z.string().url().optional(),
  weight: z.number().positive().optional(),
});

// --- Response Schemas ---
export const ecotrackUpdateParcelResponseSuccess = z.object({
  success: z.literal(true),
  message: z.string(),
});

export const ecotrackUpdateParcelResponseError = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())),
});

export const ecotrackUpdateParcelResponseSchema = z.union([
  ecotrackUpdateParcelResponseSuccess,
  ecotrackUpdateParcelResponseError,
]);

// --- Type Inference ---
export type EcotrackUpdateParcelRequest = z.infer<typeof ecotrackUpdateParcelSchema>;
export type EcotrackUpdateParcelResponseSuccess = z.infer<typeof ecotrackUpdateParcelResponseSuccess>;
export type EcotrackUpdateParcelResponseError = z.infer<typeof ecotrackUpdateParcelResponseError>;
export type EcotrackUpdateParcelResponse = z.infer<typeof ecotrackUpdateParcelResponseSchema>;
