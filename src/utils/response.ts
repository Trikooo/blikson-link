import type { Context } from "hono";
import type { AppBindings, SuccessResponse } from "@/types/api-types";

export function normalizeSuccessResponse<T extends object>(
  c: Context<AppBindings>,
  data: any,
): SuccessResponse<T> {
  return {
    success: data.success ?? true,
    requestId: c.get("requestId"),
    provider: c.get("provider"),
    ...(data.results && { results: data.results }),
    ...(data.payload !== undefined && { payload: data.payload }),
    ...(data.summary !== undefined && { summary: data.summary }),

  };
}
