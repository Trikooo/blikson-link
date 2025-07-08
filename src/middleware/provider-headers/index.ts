import { AppBindings } from "@/types/api-types";
import { ecotrackHeaderSchema } from "./ecotrack-headers.schema";
import { yalidineHeadersSchema } from "./yalidine-headers.schema";
import { Context, Next } from "hono";
import { ValidationException } from "@/errors/api-errors";

const providerHeadersSchema = {
  ecotrack: ecotrackHeaderSchema,
  yalidine: yalidineHeadersSchema,
  // more to come
};

export default async function validateProviderHeaders(
  c: Context<AppBindings>,
  next: Next
) {
  const provider = c.get("provider");
  const schema =
    providerHeadersSchema[provider as keyof typeof providerHeadersSchema];
  const result = schema.safeParse(c.req.header());
  if (!result.success) {
    throw new ValidationException(result.error.issues);
  } else {
    return next();
  }
}
