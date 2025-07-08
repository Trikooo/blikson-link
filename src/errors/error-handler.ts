import { ZodError } from "zod";
import {
  ExternalServiceException,
  UnexpectedResponseError,
  ValidationException,
  TimeoutException,
  RateLimitException,
  AuthenticationException,
  AuthorizationException,
  InternalServerException
} from "./api-errors";
import { AxiosError } from "axios";

export function handleApiError(error: unknown){
  if(error instanceof ZodError){
    throw new ValidationException(error.issues)
  }
  if(error instanceof UnexpectedResponseError){
    throw new ExternalServiceException(error.message)
  }
  if(error instanceof AxiosError){
    const status = error.response?.status;
    const code = error.code;
    const message = error.response?.data?.message || error.message || "External service error";

    // Handle specific error codes/statuses
    if (status === 408 || code === "ECONNABORTED" || message.toLowerCase().includes("timeout")) {
      throw new TimeoutException();
    }
    if (status === 429) {
      throw new RateLimitException();
    }
    if (status === 401) {
      throw new AuthenticationException("Failed to authenticate with provider");
    }
    if (status === 403) {
      throw new AuthorizationException("Access to external resource is forbidden");
    }
    if (status === 404 || status === 405 || status === 422) {
      throw new InternalServerException("Internal server error: The server failed to process your request due to an unexpected response from an upstream service. Please contact support")
    }

    // Default fallback for Axios errors
    throw new ExternalServiceException(message);
  }
  // Fallback for any other error types
  throw new InternalServerException();
}