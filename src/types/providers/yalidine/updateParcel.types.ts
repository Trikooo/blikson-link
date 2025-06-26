// ✏️ PATCH body (editable fields)
export interface YalidineUpdateParcelRequest {
  order_id?: string;
  firstname?: string;
  familyname?: string;
  contact_phone?: string;
  address?: string;
  from_wilaya_name?: string;
  to_commune_name?: string; // 🎯 Required if to_wilaya_name is provided
  to_wilaya_name?: string; // 🎯 If provided, to_commune_name is required
  product_list?: string;
  price?: number;
  do_insurance?: boolean;
  declared_value?: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  freeshipping?: boolean;
  is_stopdesk?: boolean;
  stopdesk_id?: number; // 🎯 Required if is_stopdesk is true
  has_exchange?: boolean;
  product_to_collect?: string; // 🎯 Required if has_exchange is true
}

// 📤 Response on success
export interface YalidineUpdateParcelResponseSuccess {
  tracking: string;
  order_id: string;
  firstname: string;
  familyname: string;
  contact_phone: string;
  address: string;
  from_wilaya_name: string;
  to_commune_name: string;
  to_wilaya_name: string;
  product_list: string;
  price: number;
  do_insurance: boolean;
  declared_value: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  freeshipping: boolean;
  is_stopdesk: boolean;
  stopdesk_id: number | null;
  has_exchange: boolean | 0 | 1;
  product_to_collect: string | null;
  label: string;
}

// ❌ Error response when updating a parcel fails
export interface YalidineUpdateParcelErrorResponse {
  error: {
    message: string;
    code: number;
    description: string;
  };
}

// 🔁 Union of success and error responses
export type YalidineUpdateParcelResponse =
  | YalidineUpdateParcelResponseSuccess
  | YalidineUpdateParcelErrorResponse;
