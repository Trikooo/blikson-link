import { HTTPException } from "hono/http-exception";
import { AppBindings, ErrorResponse } from "../types/api-types";
import { ZodIssue } from "zod";
import { ContentfulStatusCode } from "hono/utils/http-status";
import * as httpStatusCodes from "stoker/http-status-codes";

import { Context } from "hono";
// Base API Exception class
export class ApiException extends HTTPException {
  public readonly issues?: ZodIssue[];

  constructor(
    status: ContentfulStatusCode,
    message: string,
    issues?: ZodIssue[]
  ) {
    super(status, { message });

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
      issues: this.issues?.map((issue) => ({
        message: issue.message,
        path: issue.path,
      })),
    };
  }
}

// Validation Exception - 422
export class ValidationException extends ApiException {
  constructor(
    issues: ZodIssue[],
    message: string = "Request data is invalid. Check the 'issues' field for details."
  ) {
    super(httpStatusCodes.UNPROCESSABLE_ENTITY, message, issues);
  }
}

// Authentication Exception - 401
export class AuthenticationException extends ApiException {
  constructor(message: string = "Authentication required", company?: string) {
    super(httpStatusCodes.UNAUTHORIZED, message);
  }
}

// Authorization Exception - 403
export class AuthorizationException extends ApiException {
  constructor(message: string = "Access denied") {
    super(httpStatusCodes.FORBIDDEN, message);
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
    message: string = `${method} not allowed, use ${allowedMethod}`
  ) {
    super(httpStatusCodes.METHOD_NOT_ALLOWED, message);
  }
}

// Rate Limit Exception - 429
export class RateLimitException extends ApiException {
  constructor(message: string = "Rate limit exceeded") {
    super(httpStatusCodes.TOO_MANY_REQUESTS, message);
  }
}

// External Service Exception - 502
export class ExternalServiceException extends ApiException {
  constructor(message: string = "External service unavailable") {
    super(httpStatusCodes.BAD_GATEWAY, message);
  }
}

// Timeout Exception - 408
export class TimeoutException extends ApiException {
  constructor(message: string = "Request timeout") {
    super(httpStatusCodes.REQUEST_TIMEOUT, message);
  }
}

// Internal Server Exception - 500
export class InternalServerException extends ApiException {
  constructor(message: string = "Internal server error") {
    super(httpStatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}

export class UnexpectedResponseError extends Error {
  public readonly name: "UnexpectedResponseError" = "UnexpectedResponseError";

  constructor(message = "Upstream returned an unexpected response.") {
    super(message);
    // Maintains proper stack trace (for V8 engines like Node)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
