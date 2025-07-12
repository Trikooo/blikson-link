import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";

/**
 * Builds a full URL using the baseUrl from companyMetadata and the endpoint from actionMetadata in the context.
 *
 * @param c - The Hono context containing companyMetadata.baseUrl and actionMetadata.endpoint
 * @returns A clean, concatenated URL (e.g., "https://api.example.com/get/data")
 */
export function buildUrl(c: Context<AppBindings>): string {
  const { endpoint } = c.get("actionMetadata");
  const { baseUrl } = c.get("companyMetadata");
  return `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
}
