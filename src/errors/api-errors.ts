import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ZodIssue } from "zod";
import type { AppBindings, ErrorResponse, SimplifiedIssue } from "../types/api-types";

import { HTTPException } from "hono/http-exception";

import * as httpStatusCodes from "stoker/http-status-codes";

import { ZodError } from "zod";
// Base API Exception class
export class ApiException extends HTTPException {
  public readonly issues?: ZodIssue[];
  public readonly providerError: any;

  constructor(
    status: ContentfulStatusCode,
    message: string,
    issues?: ZodIssue[],
    providerError?: any,
  ) {
    super(status, { message });
    this.providerError = providerError;
    this.issues = issues;
  }

  // Convert exception to ErrorResponse format
  toErrorResponse(c: Context<AppBindings>): ErrorResponse {
    const provider = c.get("provider");
    const requestId = c.get("requestId");
    return {
      success: false,
      requestId,
      provider,
      timestamp: new Date().toISOString(),
      message: this.message,
      issues: this.issues?.map(issue => ({
        message: issue.message,
        path: issue.path.length <= 1 ? issue.path[0] : issue.path,
      })) as SimplifiedIssue[],
    };
  }
}

// Validation Exception - 422
export class ValidationException extends ApiException {
  constructor(
    issues: ZodIssue[],
    message: string = "Request data is invalid. Check the 'issues' field for details.",
    providerError?: any,
  ) {
    super(httpStatusCodes.UNPROCESSABLE_ENTITY, message, issues, providerError);
  }
}

// Authentication Exception - 401
export class AuthenticationException extends ApiException {
  constructor(message: string = "Authentication required", providerError?: any) {
    super(httpStatusCodes.UNAUTHORIZED, message, undefined, providerError);
  }
}

// Authorization Exception - 403
export class AuthorizationException extends ApiException {
  constructor(message: string = "Access denied", providerError?: any) {
    super(httpStatusCodes.FORBIDDEN, message, undefined, providerError);
  }
}

// Not Found Exception - 404
export class NotFoundException extends ApiException {
  constructor(message: string = "Resource not found") {
    super(httpStatusCodes.NOT_FOUND, message);
  }
}

// Company Not Found Exception - 404
export class CompanyNotFoundException extends ApiException {
  constructor(message: string = "Company not found") {
    super(httpStatusCodes.NOT_FOUND, message);
  }
}

// Action Not Found Exception - 404
export class ActionNotFoundException extends ApiException {
  constructor(message = "Action not found") {
    super(httpStatusCodes.NOT_FOUND, message);
  }
}

// Method Not Allowed Exception - 405
export class MethodNotAllowedException extends ApiException {
  constructor(
    method: string,
    allowedMethod: string,
    message: string = `${method} not allowed, use ${allowedMethod}`,
  ) {
    super(httpStatusCodes.METHOD_NOT_ALLOWED, message);
  }
}

// Rate Limit Exception - 429
export class RateLimitException extends ApiException {
  constructor(message: string = "Rate limit exceeded", providerError?: any) {
    super(httpStatusCodes.TOO_MANY_REQUESTS, message, undefined, providerError);
  }
}

// External Service Exception - 502
export class ExternalServiceException extends ApiException {
  constructor(message: string = "External service unavailable", providerError?: any) {
    super(httpStatusCodes.BAD_GATEWAY, message, undefined, providerError);
  }
}

// Timeout Exception - 408
export class TimeoutException extends ApiException {
  constructor(message: string = "Request timeout", providerError?: any) {
    super(httpStatusCodes.REQUEST_TIMEOUT, message, undefined, providerError);
  }
}

// Internal Server Exception - 500
export class InternalServerException extends ApiException {
  constructor(message: string = "Internal server error", providerError?: any) {
    super(httpStatusCodes.INTERNAL_SERVER_ERROR, message, undefined, providerError);
  }
}

export class UnexpectedResponseError extends Error {
  public readonly name = "UnexpectedResponseError" as const;

  constructor(error: unknown, message = "Upstream returned an unexpected success response.") {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Log Zod issues if relevant
    if (error instanceof ZodError) {
      const issues = error.errors.map(issue => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      console.warn("🧩 Zod error validating response:", issues);
    }
  }
}

export class NotFoundError extends Error {
  public readonly name = "NotFoundError" as const;
  public readonly providerError?: any;

  constructor(message = "Resource not found", providerError?: any) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.providerError = providerError;
  }
}
