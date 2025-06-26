// Request params
export interface GetCommunesQueryParams {
  wilaya_id?: number; // optional, between 1 and 58
}

// Single commune entry
export interface Commune {
  nom: string;
  wilaya_id: number;
  code_postal: string;
  has_stop_desk: number; // 0 or 1
}

// Success response (record with numeric keys)
export type GetCommunesSuccessResponse = Record<string, Commune>;

// Error response for wrong HTTP method
export interface GetCommunesErrorResponse {
  message: string; // e.g. "The POST method is not supported for route api/v1/get/communes. Supported methods: GET, HEAD."
}

// Final union
export type GetCommunesResponse =
  | GetCommunesSuccessResponse
  | GetCommunesErrorResponse;
