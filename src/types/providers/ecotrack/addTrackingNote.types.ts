export interface AddTrackingNoteRequest {
  tracking: string;
  content: string;
}

export interface AddTrackingNoteResponseSuccess {
  success: true;
  message: string;
}

export interface AddTrackingNoteResponseError {
  message: string;
  errors: Record<string, string[]>;
}

export type AddTrackingNoteResponse =
  | AddTrackingNoteResponseSuccess
  | AddTrackingNoteResponseError;
