export interface DeleteParcelRequest {
  tracking: string;
}

export interface DeleteParcelResponseSuccess {
  success: true;
}

export interface DeleteParcelResponseError {
  success: false;
  error: number;
  message: string;
}

export type DeleteParcelResponse =
  | DeleteParcelResponseSuccess
  | DeleteParcelResponseError;
