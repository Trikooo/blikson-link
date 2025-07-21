import { z } from "zod";

export const rawEcotrackParcelSchema = z.object({
  reference: z.string().optional(),
  nom_client: z.string(),
  telephone: z.string(),
  telephone_2: z.string().optional(),
  adresse: z.string(),
  code_postal: z.string().optional(),
  commune: z.string(),
  code_wilaya: z.number(),
  montant: z.number(),
  remarque: z.string().optional(),
  produit: z.string().optional(),
  stock: z.union([z.literal(0), z.literal(1)]).optional(),
  quantite: z.number().optional(),
  produit_a_recuperer: z.string().optional(),
  boutique: z.string().optional(),
  type: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  stop_desk: z.union([z.literal(0), z.literal(1)]).optional(),
  weight: z.number().optional(),
  fragile: z.union([z.literal(0), z.literal(1)]),
  gps_link: z.string().url().optional(),
}).refine(
  data => data.stock !== 1 || typeof data.quantite === "number",
  {
    message: "quantite is required when stock is true",
    path: ["quantite"],
  },
);

// ✅ Response schemas
// 200 OK – success
export const ecotrackCreateParcelResponseSuccessSchema = z.union([
  z.object({
    success: z.literal(true),
    tracking: z.string(),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
  }),
]);

// 200 OK – business logic failure ❌
export const ecotrackCreateParcelResponseBusinessErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
});

// 422 Unprocessable Entity – validation errors
export const ecotrackCreateParcelResponseValidationErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())),
});

// 🔀 Full response schema
export const ecotrackCreateParcelResponseSchema = z.union([
  ecotrackCreateParcelResponseSuccessSchema,
  ecotrackCreateParcelResponseBusinessErrorSchema,
  ecotrackCreateParcelResponseValidationErrorSchema,
]);

// ✅ Inferred Types
export type RawEcotrackParcel = z.infer<typeof rawEcotrackParcelSchema>;
export type EcotrackCreateParcelResponse = z.infer<typeof ecotrackCreateParcelResponseSchema>;
