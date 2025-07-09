// ✅ Request Params
export interface YalidineGetWilayasQueryParams {
  id?: string; // comma-separated list
  name?: string;
  fields?: string;
  page?: number;
  page_size?: number;
  order_by?: "id" | "name";
  desc?: null;
  asc?: null;
}

// ✅ Success Response
export interface YalidineWilaya {
  id: number;
  name: string;
  zone: number;
  is_deliverable: boolean;
}

export interface YalidineGetWilayasSuccessResponse {
  has_more: boolean;
  total_data: number;
  data: YalidineWilaya[];
  links: {
    self: string;
  };
}

// ❌ Error Response
export interface YalidineGetWilayasErrorResponse {
  error: {
    message: string;
    code: number;
    description: string;
  };
}

// 🔁 Final Union Type
export type YalidineGetWilayasResponse
  = | YalidineGetWilayasSuccessResponse
    | YalidineGetWilayasErrorResponse;
