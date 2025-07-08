// Single fee entry (for a wilaya)
export interface EcotrackFeeEntry {
  wilaya_id: number;
  tarif: string; // e.g. "850"
  tarif_stopdesk: string; // e.g. "450"
}

// Full response structure for each fee type
export interface EcotrackGetFeesSuccessResponse {
  livraison: EcotrackFeeEntry[];
  pickup: EcotrackFeeEntry[];
  echange?: EcotrackFeeEntry[];
  recouvrement?: EcotrackFeeEntry[];
  retour?: EcotrackFeeEntry[];
}

// Error response for invalid HTTP method
export interface EcotrackGetFeesErrorResponse {
  message: string; // "The POST method is not supported for route ..."
}

// Final union
export type EcotrackGetFeesResponse = EcotrackGetFeesSuccessResponse | EcotrackGetFeesErrorResponse;
