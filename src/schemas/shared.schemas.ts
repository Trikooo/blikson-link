import { z } from "zod";
import { LANDLINE_WILAYA_CODES } from "@/constants/wilayas";

export const wilayaIdSchema = z
  .number()
  .int("wilayaId must be an integer between 1 and 58")
  .min(1, { message: "wilayaId must be between 1 and 58" })
  .max(58, { message: "wilayaId must be between 1 and 58" });

export type WilayaId = z.infer<typeof wilayaIdSchema>;

export const algerianPhoneSchema = z
  .string()
  .trim()
  .refine((input) => {
    const number = input.replace(/[\s\-]/g, "");

    // Mobile: 0[5-7]xxxxxxxx or +213[5-7]xxxxxxxx
    if (/^(?:0|\+213)[567]\d{8}$/.test(number)) {
      return true;
    }

    // Landline: 0yyxxxxxx or +213yyxxxxxx
    const match = number.match(/^(?:\+213|0)(\d{2})(\d{6})$/);
    if (match) {
      const [_, code] = match;
      return LANDLINE_WILAYA_CODES.includes(`0${code}`);
    }

    return false;
  }, {
    message: "Invalid Algerian phone number",
  });
