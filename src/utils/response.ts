import type { Context } from "hono";
import type { AppBindings, SuccessResponse } from "@/types/api-types";

export function normalizeSuccessResponse<T extends object>(
  c: Context<AppBindings>,
  data: any,
): SuccessResponse<T> {
  const success = data.error ? "partial" : true;
  console.error("hello", data.error);
  console.error("success: ", typeof success);

  return {
    success,
    requestId: c.get("requestId"),
    provider: c.get("provider"),
    payload: data,
  };
}
