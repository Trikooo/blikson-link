// ✅ Request Params
export interface YalidineGetFeesQueryParams {
  from_wilaya_id: number;
  to_wilaya_id: number;
}

// 🟩 Commune Fee Detail
export interface YalidineCommuneFee {
  commune_id: number;
  commune_name: string;
  express_home: number | null;
  express_desk: number | null;
  economic_home: number | null;
  economic_desk: number | null;
}

// 🟩 Success Response
export interface YalidineGetFeesSuccessResponse {
  from_wilaya_name: string;
  to_wilaya_name: string;
  zone: number;
  retour_fee: number;
  cod_percentage: number;
  insurance_percentage: number;
  oversize_fee: number;
  per_commune: Record<string, YalidineCommuneFee>;
}

// ❌ Error Response
export interface YalidineGetFeesErrorResponse {
  error: {
    message: string;
    code: number;
    description: string;
  };
}

// 🔁 Final Union
export type YalidineGetFeesResponse
  = | YalidineGetFeesSuccessResponse
    | YalidineGetFeesErrorResponse;
