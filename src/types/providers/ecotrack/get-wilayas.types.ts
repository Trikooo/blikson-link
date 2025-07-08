// Successful response for /get/wilayas
export interface EcotrackWilaya {
  wilaya_id: number;
  wilaya_name: string;
}

export type EcotrackGetWilayasSuccessResponse = EcotrackWilaya[];

// Error response when using wrong HTTP method
export interface EcotrackGetWilayasErrorResponse {
  message: string; // e.g., "The POST method is not supported for route api/v1/get/wilayas. Supported methods: GET, HEAD."
}

// Final union type
export type EcotrackGetWilayasResponse = EcotrackGetWilayasSuccessResponse | EcotrackGetWilayasErrorResponse;
