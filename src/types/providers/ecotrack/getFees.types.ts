// Single fee entry (for a wilaya)
export interface FeeEntry {
  wilaya_id: number;
  tarif: string; // e.g. "850"
  tarif_stopdesk: string; // e.g. "450"
}

// Full response structure for each fee type
export interface GetFeesSuccessResponse {
  livraison: FeeEntry[];
  pickup: FeeEntry[];
  echange?: FeeEntry[];
  recouvrement?: FeeEntry[];
  retour?: FeeEntry[];
}

// Error response for invalid HTTP method
export interface GetFeesErrorResponse {
  message: string; // "The POST method is not supported for route ..."
}

// Final union
export type GetFeesResponse = GetFeesSuccessResponse | GetFeesErrorResponse;
