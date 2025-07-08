import z from "zod";

export const yalidineHeadersSchema = z.object({
  "X-YALIDINE-API-ID": z.string().min(1, "Yalidine API ID is required"),
  "X-YALIDINE-API-TOKEN": z.string().min(1, "Yalidine API token is required"),
});
