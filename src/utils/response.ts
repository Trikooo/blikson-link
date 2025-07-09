import type { Context } from "hono";
import type { AppBindings, SuccessResponse } from "@/types/api-types";

export function normalizeSuccessResponse<T extends object>(
  c: Context<AppBindings>,
  data: T,
): SuccessResponse<T> {
  return {
    success: true,
    requestId: c.get("requestId"),
    provider: c.get("provider"),
    ...data,
  };
}
