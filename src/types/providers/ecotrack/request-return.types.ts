export interface EcotrackRequestReturnRequest {
  tracking: string;
}

export interface EcotrackRequestReturnResponseSuccess {
  success: true;
  message?: string; // assuming there might be a message
}

export interface EcotrackRequestReturnResponseError {
  success: false;
  error: number;
  message: string;
}

export type EcotrackRequestReturnResponse =
  | EcotrackRequestReturnResponseSuccess
  | EcotrackRequestReturnResponseError;
