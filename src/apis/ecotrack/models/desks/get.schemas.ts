import { z } from "zod";
import { wilayaCodeSchema } from "@/schemas/shared.schemas";

export const getDesksQuerySchema = z.object({
  wilayaId: z
    .string()
    .regex(/^\d+$/, "Wilaya must be a number between 1 and 58")
    .transform(val => Number(val))
    .refine(val => val >= 1 && val <= 58, {
      message: "Wilaya must be a number between 1 and 58",
    })
    .optional(),
});

export const deskLocationSchema = z.object({
  name: z.string(),
  postalCode: z.string(),
});

export const desksResponseSchema = z.object({
  desks: z.record(wilayaCodeSchema, z.array(deskLocationSchema)),
});

export type DesksResponse = z.infer<typeof desksResponseSchema>;
