export interface RequestReturnRequest {
  tracking: string;
}

export interface RequestReturnResponseSuccess {
  success: true;
  message?: string; // assuming there might be a message
}

export interface RequestReturnResponseError {
  success: false;
  error: number;
  message: string;
}

export type RequestReturnResponse =
  | RequestReturnResponseSuccess
  | RequestReturnResponseError;
