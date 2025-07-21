import { z } from "zod";
import { algerianPhoneSchema, wilayaIdSchema } from "../shared.schemas";

function trimmedString(max: number = 255) {
  return z.string().trim().min(1).max(max);
}
export const normalizedEcotrackParcelSchema = z
  .object({
    id: trimmedString().optional(),
    name: trimmedString(),
    phoneNumber: algerianPhoneSchema,
    phoneNumberAlt: algerianPhoneSchema.optional(),
    wilayaId: wilayaIdSchema,
    commune: trimmedString(),
    address: trimmedString(),
    operationType: z.union(
      [
        z.literal("delivery"),
        z.literal("pickup"),
        z.literal("exchange"),
        z.literal("recovery"),
      ],
      {
        errorMap: () => ({
          message:
            "Invalid operationType. Allowed values: 'delivery' 'pickup' 'exchange' 'recovery'",
        }),
      },
    ),
    shippingPrice: z.number().int().nonnegative().optional(),
    postalCode: trimmedString(5).optional(),
    productName: trimmedString().optional(),
    productValue: z.number().int().positive(),
    fromStock: z.boolean().optional(),
    quantity: z.number().int().positive().optional(),
    productToCollect: trimmedString().optional(),
    storeName: trimmedString().optional(),
    isStopDesk: z.boolean().optional(),
    weight: z.number().positive().optional(),
    isFragile: z.boolean().optional(),
    notes: trimmedString().optional(),
    gpsLink: z.string().url().max(255).optional(),
  })
  .refine(
    (data) => {
      if (data.fromStock === true)
        return data.quantity !== undefined;
      return true;
    },
    {
      message: "quantity is required when fromStock is true",
      path: ["quantity"],
    },
  )
  .refine(
    (data) => {
      if (data.operationType === "exchange")
        return data.productToCollect !== undefined;
      return true;
    },
    {
      message:
        "productToCollect is required when operationType is 'exchange'",
      path: ["productToCollect"],
    },
  );
export const normalizedEcotrackParcelUpdateSchema = z.object({
  id: trimmedString().optional(),
  name: trimmedString(),
  phoneNumber: algerianPhoneSchema,
  phoneNumberAlt: algerianPhoneSchema.optional(),
  wilayaId: wilayaIdSchema,
  commune: trimmedString(),
  address: trimmedString(),
  operationType: z.union([
    z.literal("delivery"),
    z.literal("pickup"),
    z.literal("exchange"),
    z.literal("recovery"),
  ]),
  shippingPrice: z.number().int().nonnegative().optional(),
  postalCode: trimmedString(5).optional(),
  productName: trimmedString().optional(),
  productValue: z.number().int().positive(),
  storeName: trimmedString().optional(),
  isStopDesk: z.boolean().optional(),
  isFragile: z.boolean().optional(),
  notes: trimmedString().optional(),
  gpsLink: z.string().url().max(255).optional(),
  weight: z.number().positive().optional(),
});
export const normalizedEcotrackShipParcelSchema = z.object({
  requestPickup: z.boolean().default(false),
});
export type NormalizedEcotrackParcel = z.infer<typeof normalizedEcotrackParcelSchema>;
export type NormalizedEcotrackParcelUpdate = z.infer<typeof normalizedEcotrackParcelUpdateSchema>;
export type NormalizedEcotrackShipParcel = z.infer<typeof normalizedEcotrackShipParcelSchema>;
