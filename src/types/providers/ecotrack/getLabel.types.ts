export interface GetLabelRequest {
  tracking: string;
}

export type GetLabelResponseSuccess = ArrayBuffer;

export interface GetLabelResponseError {
  message: string;
  errors: Record<string, string[]>;
}

export type GetLabelResponse = GetLabelResponseSuccess | GetLabelResponseError;
