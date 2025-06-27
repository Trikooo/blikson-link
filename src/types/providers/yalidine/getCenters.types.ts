//  Query Parameters for GET /v1/centers
export interface YalidineGetCentersQueryParams {
  center_id?: number | number[]; // single or multiple
  commune_id?: number | number[];
  commune_name?: string | string[];
  wilaya_id?: number | number[];
  wilaya_name?: string | string[];
  fields?: string; // comma-separated fields, e.g. "center_id,name"
  page?: number;
  page_size?: number;
  order_by?: "center_id" | "commune_id" | "wilaya_id";
  desc?: null;
  asc?: null;
}
// ✅ Success Response Type 📦
export interface YalidineCenter {
  center_id: number;
  name: string;
  address: string;
  gps: string;
  commune_id: number;
  commune_name: string;
  wilaya_id: number;
  wilaya_name: string;
}

export interface YalidineGetCentersSuccessResponse {
  has_more: boolean;
  total_data: number;
  data: YalidineCenter[];
  links: {
    self: string;
    next?: string;
  };
}

// ❌ Error Response Type
export interface YalidineGetCentersErrorResponse {
  error: {
    message: string;
    code: number;
    description: string;
  };
}

// 🔁 Union Type
export type YalidineGetCentersResponse =
  | YalidineGetCentersSuccessResponse
  | YalidineGetCentersErrorResponse;
