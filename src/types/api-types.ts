import type { Context } from "hono";
import type { PinoLogger } from "hono-pino";
import type { ActionMetadata, CompanyMetadata, Provider } from "./config-types";

// Base API response interface that all responses should extend
export interface BaseApiResponse {
  success: boolean;
  requestId: string;
  provider?: string; // Which provider handled the request
}
export interface SimplifiedIssue {
  message: string;
  path: string | string[];
}
// Error response with errors
export interface ErrorResponse extends BaseApiResponse {
  success: false;
  timestamp: string;
  message: string;
  issues?: SimplifiedIssue[];

}

// Success response with generic data type
export type SuccessResponse<T> = BaseApiResponse & {
  success: true;
  payload: T;
};

// Union type of all possible API responses
export type ApiResponse<T>
  = | SuccessResponse<T>
    | ErrorResponse;

export interface AppBindings {
  Variables: {
    company: string;
    provider: Provider;
    logger: PinoLogger;
    actionPath: string;
    actionFn: (c: Context<any>) => Promise<any>;
    actionMetadata: ActionMetadata;
    companyMetadata: CompanyMetadata;
  };
}
