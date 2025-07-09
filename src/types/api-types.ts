import { PinoLogger } from "hono-pino";
import { ZodIssue } from "zod";
import { ActionMetaData, CompanyMetaData, Provider } from "./config-types";
import { Context } from "hono";

// Base API response interface that all responses should extend
export interface BaseApiResponse {
  success: boolean;
  requestId: string;
  provider?: string; // Which provider handled the request
}

//Error response with error details
export interface ErrorResponse extends BaseApiResponse {
  success: false;
  message: string;
  issues?: Partial<ZodIssue>[];
  timestamp: string;
}

//Success response with generic data type
export type SuccessResponse<T extends object> = BaseApiResponse & {
  success: true;
} & T;

// Union type of all possible API responses
export type ApiResponse<T extends object = {}> =
  | SuccessResponse<T>
  | ErrorResponse;

export type AppBindings = {
  Variables: {
    company: string;
    provider: Provider;
    logger: PinoLogger;
    actionPath: string;
    actionFn: (c: Context<any>) => Promise<any>;
    actionMetaData: ActionMetaData
    companyMetaData: CompanyMetaData
  };
};
