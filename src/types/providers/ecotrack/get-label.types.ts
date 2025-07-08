export interface EcotrackGetLabelRequest {
  tracking: string;
}

export type EcotrackGetLabelResponseSuccess = ArrayBuffer;

export interface EcotrackGetLabelResponseError {
  message: string;
  errors: Record<string, string[]>;
}

export type EcotrackGetLabelResponse = EcotrackGetLabelResponseSuccess | EcotrackGetLabelResponseError;
