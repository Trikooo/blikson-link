export interface EcotrackAddTrackingNoteRequest {
  tracking: string;
  content: string;
}

export interface EcotrackAddTrackingNoteResponseSuccess {
  success: true;
  message: string;
}

export interface EcotrackAddTrackingNoteResponseError {
  message: string;
  errors: Record<string, string[]>;
}

export type EcotrackAddTrackingNoteResponse
  = | EcotrackAddTrackingNoteResponseSuccess
    | EcotrackAddTrackingNoteResponseError;
