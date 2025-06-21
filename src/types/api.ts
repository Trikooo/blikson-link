import { ZodIssue } from "zod";

/**
 * Base API response interface that all responses should extend
 */
export interface BaseApiResponse {
  success: boolean;
  requestId: string;
  timestamp: string;
}

/**
 * Error response with error details
 */
export interface ErrorResponse extends BaseApiResponse {
  success: false;
  error: {
    status: number;
    code: string;
    message: string;
    company?: string;
    action?: string;
    errorFields?: ZodIssue[];
  };
}

/**
 * Success response with generic data type
 */
export interface SuccessResponse<T> extends BaseApiResponse {
  success: true;
  data: T;
}

/**
 * Union type of all possible API responses
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
