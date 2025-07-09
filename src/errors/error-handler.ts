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

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    throw new ValidationException(error.issues);
  }
  if (error instanceof UnexpectedResponseError) {
    throw new ExternalServiceException(error.message);
  }
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const code = error.code;
    const message
      = error.response?.data?.message
        || error.message
        || "External service error";

    // Handle specific error codes/statuses
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
      throw new AuthenticationException(
        "Failed to authenticate with provider",
        error,
      );
    }
    if (status === 403) {
      throw new AuthorizationException(
        "Access to external resource is forbidden",
        error,
      );
    }
    if (status === 404 || status === 405 || status === 422) {
      throw new InternalServerException(
        "Internal server error: The server failed to process your request due to an unexpected response from an upstream service. Please contact support",
        error,
      );
    }

    // Default fallback for Axios errors
    throw new ExternalServiceException(message, error);
  }
  // Fallback for any other error types
  throw new InternalServerException(undefined, error);
}
