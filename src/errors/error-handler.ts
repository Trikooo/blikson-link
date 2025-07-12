import { AxiosError } from "axios";
import { ZodError } from "zod";
import {
  AuthenticationException,
  AuthorizationException,
  ExternalServiceException,
  InternalServerException,
  RateLimitException,
  TimeoutException,
  UnexpectedResponseError,
  ValidationException,
} from "./api-errors";

function logJsErrorDetails(error: unknown) {
  console.error("❌ JS Error caught:", {
    name: (error as any)?.name,
    message: (error as any)?.message,
    stack: (error as any)?.stack,
    constructor: (error as any)?.constructor?.name,
  });
}

export function handleApiError(error: unknown): never {
  // 🧪 Zod validation error
  if (error instanceof ZodError) {
    throw new ValidationException(error.issues);
  }

  // 🧨 Invalid JSON body
  if (error instanceof SyntaxError && error.message.includes("JSON")) {
    logJsErrorDetails(error);
    throw new ValidationException([
      {
        code: "custom",
        message: "Invalid JSON format",
        path: [],
      },
    ]);
  }

  // 💥 Unexpected response shape
  if (error instanceof UnexpectedResponseError) {
    throw new ExternalServiceException(error.message);
  }

  // 🌐 Axios or HTTP client error
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const code = error.code;
    const message
      = error.response?.data?.message
        || error.message
        || "External service error";

    if (
      status === 408
      || code === "ECONNABORTED"
      || message.toLowerCase().includes("timeout")
    ) {
      throw new TimeoutException(undefined, error);
    }

    if (status === 429) {
      throw new RateLimitException(undefined, error);
    }

    if (status === 401) {
      throw new AuthenticationException("Failed to authenticate with provider", error);
    }

    if (status === 403) {
      throw new AuthorizationException("Access to external resource is forbidden", error);
    }

    if ([404, 405, 422].includes(status ?? 0)) {
      throw new InternalServerException("Internal server error, Unexpected upstream error", error);
    }

    throw new ExternalServiceException(message, error);
  }

  // 🛠 Native JS errors
  if (
    error instanceof TypeError
    || error instanceof ReferenceError
    || error instanceof RangeError
    || error instanceof EvalError
    || error instanceof URIError
  ) {
    logJsErrorDetails(error);
    throw new InternalServerException("Internal JS runtime error", error);
  }

  // 🧼 Unknown fallback
  logJsErrorDetails(error);
  throw new InternalServerException(undefined, error);
}
