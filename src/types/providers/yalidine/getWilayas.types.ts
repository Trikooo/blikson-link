// ✅ Request Params
export type YalidineGetWilayasQueryParams = {
  id?: string; // comma-separated list
  name?: string;
  fields?: string;
  page?: number;
  page_size?: number;
  order_by?: "id" | "name";
  desc?: null;
  asc?: null;
};

// ✅ Success Response
export type YalidineWilaya = {
  id: number;
  name: string;
  zone: number;
  is_deliverable: boolean;
};

export type YalidineGetWilayasSuccessResponse = {
  has_more: boolean;
  total_data: number;
  data: YalidineWilaya[];
  links: {
    self: string;
  };
};

// ❌ Error Response
export type YalidineGetWilayasErrorResponse = {
  error: {
    message: string;
    code: number;
    description: string;
  };
};

// 🔁 Final Union Type
export type YalidineGetWilayasResponse =
  | YalidineGetWilayasSuccessResponse
  | YalidineGetWilayasErrorResponse;
