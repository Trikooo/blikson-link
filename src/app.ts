import type { AppBindings } from "@/types/api-types";
import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { notFound } from "stoker/middlewares";
import serveFavicon from "@/middleware/favicon-handler";
import env from "./lib/env";
import onError from "./middleware/on-error";
import logger from "./middleware/pino-logger";
import { prettyServerLog } from "./utils/server-log";

export function createHonoInstance() {
  return new Hono<AppBindings>();
}

export default function createApp() {
  const app = createHonoInstance();
  app.use("*", requestId());
  app.use(logger());
  app.onError(onError);
  app.notFound(notFound);
  app.use(serveFavicon);
  startServer(app, env.PORT, 10);
  return app;
}
/**
 * This function starts the server.
 * @param  app - The Hono instance.
 * @param  startPort - The starting port for the server.
 * @param  maxAttempts - The maximum number of attempts to start the server.
 * @returns Resolves when the server starts or throws on failure.
 */

export async function startServer(
  app: Hono<AppBindings>,
  startPort = 3000,
  maxAttempts = 10,
) {
  console.clear();
  let port = startPort;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      Bun.serve({ port, fetch: app.fetch });
      prettyServerLog(port);
      env.PORT = port;
      return;
    }
    catch (err) {
      if (
        typeof err === "object"
        && err !== null
        && "code" in err
        && (err as any).code === "EADDRINUSE"
      ) {
        // add a line break
        console.warn(
          `\x1B[2m⚠️  \x1B[33m\x1B[2mPort ${port} in use, trying ${
            port + 1
          }...\x1B[0m\n`,
        );
        port++;
      }
      else {
        throw err;
      }
    }
  }
  console.error("❌ Could not find an open port");
  console.info(
    `📢 \x1B[33mTried ports from ${startPort} to ${
      startPort + maxAttempts
    }\x1B[0m`,
  );
  process.exit(1);
}
