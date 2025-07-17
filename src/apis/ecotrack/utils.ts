import type { Context } from "hono";
import type { AppBindings } from "@/types/api-types";
import { ZodError } from "zod";

/**
 * Rate limit headers interface based on EcoTrack API documentation
 */
export interface RateLimitHeaders {
  "X-RateLimit-Limit-Day": string;
  "X-RateLimit-Remaining-Day": string;
  "X-RateLimit-Reset-Day": string;
  "X-RateLimit-Limit-Hour": string;
  "X-RateLimit-Remaining-Hour": string;
  "X-RateLimit-Reset-Hour": string;
}

/**
 * Constructs headers for EcoTrack API requests
 * @param c - The Hono context containing request headers
 * @returns  Headers object
 * @throws  When ecotrack-token header is missing
 */
export function constructHeaders(c: Context) {
  const token = c.req.header("ecotrack-token");
  if (!token) {
    throw new Error("EcoTrack API token is required");
  }

  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
}

/**
 * Helper function to check if we're approaching rate limits
 * @param headers - Response headers from EcoTrack API
 * @returns Object containing rate limit status
 */
export function checkRateLimits(headers: Partial<RateLimitHeaders>) {
  const remainingDay = Number.parseInt(headers["X-RateLimit-Remaining-Day"] || "0");
  const remainingHour = Number.parseInt(headers["X-RateLimit-Remaining-Hour"] || "0");

  return {
    isNearDailyLimit: remainingDay < 100,
    isNearHourlyLimit: remainingHour < 100,
    remainingDay,
    remainingHour,
  };
}

export function normalizeAlgerianPhone(phone: string) {
  return phone.trim().replace(/^(\+213)/, "0");
}

export const ecotrackOperationMap = {
  delivery: 1,
  exchange: 2,
  pickup: 3,
  recovery: 4,
} as const;

export function resolveTrackingNumber(c: Context<AppBindings>, trackingNumber?: string) {
  const resolved = trackingNumber || c.req.param("id");
  if (!resolved) {
    throw new ZodError([
      {
        code: "custom",
        message: "trackingNumber is required",
        path: ["trackingNumber"],
      },
    ]);
  }
  return resolved;
}
