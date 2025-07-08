import { z } from "zod";

export const wilayaCodeSchema = z.number().int().min(1).max(58);

export type WilayaCode = z.infer<typeof wilayaCodeSchema>;
