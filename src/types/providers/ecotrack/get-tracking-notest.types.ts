export interface EcotrackTrackingNote {
  remarque: string;
  commentaires: string;
  station: string;
  livreur: string;
  created_at: string;
  tracking: string;
}

export type EcotrackGetTrackingNotesResponseSuccess = EcotrackTrackingNote[];

export interface EcotrackGetTrackingNotesResponseError {
  message: string;
  errors: Record<string, string[]>;
}

export type EcotrackGetTrackingNotesResponse
  = | EcotrackGetTrackingNotesResponseSuccess
    | EcotrackGetTrackingNotesResponseError;
