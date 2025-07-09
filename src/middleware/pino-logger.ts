import { pinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";
import env from "@/lib/env";

export default function logger() {
  const isProduction = env.NODE_ENV === "production";

  return pinoLogger({
    pino: pino(
      { level: env.LOG_LEVEL },
      isProduction ? undefined : pretty(),
    ),
    http: {
      // Use the requestId from the context that the requestId middleware sets
      referRequestIdKey: "requestId",
    },
  });
}
