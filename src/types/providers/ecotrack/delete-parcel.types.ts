export interface EcotrackDeleteParcelRequest {
  tracking: string;
}

export interface EcotrackDeleteParcelResponseSuccess {
  success: true;
}

export interface EcotrackDeleteParcelResponseError {
  success: false;
  error: number;
  message: string;
}

export type EcotrackDeleteParcelResponse
  = | EcotrackDeleteParcelResponseSuccess
    | EcotrackDeleteParcelResponseError;
