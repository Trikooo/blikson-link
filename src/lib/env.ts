import { config } from "dotenv";
import { expand } from "dotenv-expand";
import z from "zod";

expand(config());

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    LOG_LEVEL: z
      .enum(["debug", "info", "warn", "error", "fatal", "trace"])
      .default("info"),
    HOST: z.string().default("localhost"),
    PORT: z.coerce.number().default(3000),
    PROTOCOL: z.enum(["http", "https"]).default("http"),
    SENTRY_DSN: z.string().url().optional(),
  })
  .refine(env => env.NODE_ENV === "development" || !!env.SENTRY_DSN, {
    message: "SENTRY_DSN is required in production",
    path: ["SENTRY_DSN"],
  });

export type Env = z.infer<typeof EnvSchema>;

const env = (() => {
  // eslint-disable-next-line no-restricted-properties
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
})();

export default env;

export function getBaseUrl() {
  const protocol = env.PROTOCOL;
  const host = env.HOST;
  const port = env.PORT;
  const nodeEnv = env.NODE_ENV;

  if (nodeEnv === "production") {
    return `${protocol}://${host}`;
  }
  else {
    return `${protocol}://${host}:${port}`;
  }
}
