import { Hono } from "hono";
import { AppBindings } from "@/types/api-types";
import logger from "./middleware/pino-logger";
import onError from "./middleware/on-error";
import { notFound } from "stoker/middlewares";
import { prettyServerLog } from "./utils/server-log";
import env from "./lib/env";
import serveFavicon from "@/middleware/favicon-handler";
import { requestId } from "hono/request-id";

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
  maxAttempts = 10
) {
  console.clear();
  let port = startPort;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      Bun.serve({ port, fetch: app.fetch });
      prettyServerLog(port);
      env.PORT = port;
      return;
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as any).code === "EADDRINUSE"
      ) {
        // add a line break
        console.warn(
          `\x1b[2m⚠️  \x1b[33m\x1b[2mPort ${port} in use, trying ${
            port + 1
          }...\x1b[0m\n`
        );
        port++;
      } else {
        throw err;
      }
    }
  }
  console.error("❌ Could not find an open port");
  console.info(
    `📢 \x1b[33mTried ports from ${startPort} to ${
      startPort + maxAttempts
    }\x1b[0m`
  );

  process.exit(1);
}
