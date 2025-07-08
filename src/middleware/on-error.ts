import { ApiException, ValidationException } from "@/errors/api-errors";
import { Context } from "hono";
import { AppBindings, ErrorResponse } from "@/types/api-types";

/**
 * Global error-handling middleware for the API.
 *
 * - Logs all errors except validation errors using the request-scoped logger (c.var.logger.error).
 * - Returns a structured JSON error response to the client.
 * - If the error is an ApiException, uses its toErrorResponse method and status code.
 * - For all other errors, returns a generic 500 Internal Server Error response with request context.
 *
 * @param error - The error thrown during request processing.
 * @param c - The Hono context, including logger and request metadata.
 * @returns A JSON error response with appropriate status code and context.
 */
export default function onError(error: Error, c: Context<AppBindings>) {
  // Log all errors except validation errors (optional: adjust as needed)
  if (!(error instanceof ValidationException)) {
    c.var.logger.error({
      message: error.message,
      name: error.name,
      stack: error.stack,
      requestId: c.get("requestId"),
      provider: c.get("provider"),
      path: c.req.path,
      method: c.req.method,
      status: (error as any).status || 500,
      timestamp: new Date().toISOString(),
    });
  }

  if (error instanceof ApiException) {
    // You can extract provider/duration here if needed
    return c.json(error.toErrorResponse(c), error.status);
  }
  const errorResponse: ErrorResponse = {
    success: false,
    requestId: c.get("requestId"),
    provider: c.get("provider"),
    message: error.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  };
  return c.json(errorResponse, 500);
}
