import z from "zod";

export const ecotrackHeaderSchema = z.object({
  "ecotrack-token": z.string({
    required_error: "'ecotrack-token' header is required",
  }),
});
