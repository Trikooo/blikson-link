import type { Context, Next } from "hono";
import type { AppBindings } from "@/types/api-types";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fileMap: Record<string, string> = {
  "/favicon.ico": "favicon.ico",
  "/apple-touch-icon.png": "apple-touch-icon.png",
  "/favicon-256x256.png": "favicon-95x95.png",
  "/web-app-manifest-icon-192.png": "web-app-manifest-icon-192.png",
  "/web-app-manifest-icon-512.png": "web-app-manifest-icon-512.png",
  "/site.webmanifest": "site.webmanifest",
};

function getMimeType(path: string): string {
  if (path.endsWith(".ico"))
    return "image/x-icon";
  if (path.endsWith(".png"))
    return "image/png";
  if (path.endsWith(".svg"))
    return "image/svg+xml";
  if (path.endsWith(".webmanifest"))
    return "application/manifest+json";
  return "application/octet-stream";
}

export default async function serveFavicon(c: Context<AppBindings>, next: Next) {
  const fileName = fileMap[c.req.path];
  if (fileName) {
    const filePath = join(process.cwd(), "src", "public", fileName);
    try {
      const buffer = await readFile(filePath);
      c.header("content-type", getMimeType(fileName));
      return c.body(buffer);
    }
    catch {
      return c.notFound();
    }
  }

  return await next();
}
