// 🧾 Query Parameters
export interface YalidineDeleteParcelsQueryParams {
  tracking?: string; // comma-separated if using method 2
}

// ✅ Success Response
export interface YalidineDeleteParcelsResponseSuccess {
  [index: number]: {
    tracking: string;
    deleted: boolean;
  };
}

// ❌ Error Response
export interface YalidineDeleteParcelsResponseError {
  error: {
    message: string;
    code: number;
    description: string;
  };
}

// 🔁 Union Response Type
export type YalidineDeleteParcelsResponse
  = | YalidineDeleteParcelsResponseSuccess
    | YalidineDeleteParcelsResponseError;
