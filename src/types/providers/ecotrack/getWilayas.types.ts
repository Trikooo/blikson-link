// Successful response for /get/wilayas
export interface Wilaya {
  wilaya_id: number;
  wilaya_name: string;
}

export type GetWilayasSuccessResponse = Wilaya[];

// Error response when using wrong HTTP method
export interface GetWilayasErrorResponse {
  message: string; // e.g., "The POST method is not supported for route api/v1/get/wilayas. Supported methods: GET, HEAD."
}

// Final union type
export type GetWilayasResponse = GetWilayasSuccessResponse | GetWilayasErrorResponse;
