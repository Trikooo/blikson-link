import { readFile } from "fs/promises";
import { join } from "path";
import { Context, Next } from "hono";
import { AppBindings } from "@/types/api-types";

export default async function serveFavicon(c: Context<AppBindings>, next: Next) {
  if (c.req.path === "/favicon.ico") {
    const faviconPath = join(process.cwd(), "src", "public", "favicon.ico");
    const buffer = await readFile(faviconPath);
    c.header("content-type", "image/x-icon");
    return c.body(buffer);
  }
  return await next();
}
