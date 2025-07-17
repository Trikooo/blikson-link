/* eslint-disable jsdoc/check-param-names */
import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";

/**
 * Builds a full URL using either the baseUrl and endpoint directly, or from the context.
 *
 *
 * @param cOrBaseUrl - The Hono context or the baseUrl string
 * @param endpoint - The endpoint string (required if baseUrl is provided)
 * @returns A clean, concatenated URL (e.g., "https://api.example.com/get/data")
 */
export function buildUrl(c: Context<AppBindings>): string;
export function buildUrl(baseUrl: string, endpoint: string): string;
export function buildUrl(cOrBaseUrl: Context<AppBindings> | string, endpoint?: string): string {
  if (typeof cOrBaseUrl !== "string") {
    // Context version
    const { endpoint: ctxEndpoint } = cOrBaseUrl.get("actionMetadata");
    const { baseUrl } = cOrBaseUrl.get("companyMetadata");
    return `${baseUrl.replace(/\/$/, "")}/${ctxEndpoint.replace(/^\//, "")}`;
  }
  else {
    // baseUrl + endpoint version
    if (!endpoint)
      throw new Error("Endpoint must be provided when using baseUrl");
    return `${cOrBaseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  }
}
