export interface YalidineGetCommunesQueryParams {
  id?: string; // e.g. "1630,1601,1620"
  wilaya_id?: string; // e.g. "16,19,6"
  has_stop_desk?: boolean;
  is_deliverable?: boolean;
  fields?: string; // e.g. "name,is_deliverable"
  page?: number;
  page_size?: number;
  order_by?: "id" | "wilaya_id";
  desc?: null;
  asc?: null;
}
// ✅ Communes Endpoint (GET /v1/communes) 🏘️
export interface YalidineCommune {
  id: number;
  name: string;
  wilaya_id: number;
  wilaya_name: string;
  has_stop_desk: boolean;
  is_deliverable: boolean;
  delivery_time_parcel: number;
  delivery_time_payment: number;
}

export interface YalidineGetCommunesSuccessResponse {
  has_more: boolean;
  total_data: number;
  data: YalidineCommune[];
  links: {
    self: string;
    next?: string;
  };
}

export interface YalidineGetCommunesErrorResponse {
  error: {
    message: string;
    code: number;
    description: string;
  };
}

export type YalidineGetCommunesResponse =
  | YalidineGetCommunesSuccessResponse
  | YalidineGetCommunesErrorResponse;
