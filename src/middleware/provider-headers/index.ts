import type { Context, Next } from "hono";
import type { AppBindings } from "@/types/api-types";
import { ValidationException } from "@/errors/api-errors";
import { ecotrackHeaderSchema } from "./ecotrack-headers.schema";
import { yalidineHeadersSchema } from "./yalidine-headers.schema";

const providerHeadersSchema = {
  ecotrack: ecotrackHeaderSchema,
  yalidine: yalidineHeadersSchema,
  // more to come
};

export default async function validateProviderHeaders(
  c: Context<AppBindings>,
  next: Next,
) {
  const provider = c.get("provider");
  const schema
    = providerHeadersSchema[provider as keyof typeof providerHeadersSchema];
  const result = schema.safeParse(c.req.header());
  if (!result.success) {
    throw new ValidationException(result.error.issues);
  }
  else {
    return next();
  }
}
