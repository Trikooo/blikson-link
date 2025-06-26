export interface TrackingNote {
  remarque: string;
  commentaires: string;
  station: string;
  livreur: string;
  created_at: string;
  tracking: string;
}

export type GetTrackingNotesResponseSuccess = TrackingNote[];

export interface GetTrackingNotesResponseError {
  message: string;
  errors: Record<string, string[]>;
}

export type GetTrackingNotesResponse =
  | GetTrackingNotesResponseSuccess
  | GetTrackingNotesResponseError;
