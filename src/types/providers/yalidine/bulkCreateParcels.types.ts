// 📥 One parcel in the request body (used in bulk or single create)
export interface YalidineCreateParcelRequest {
  order_id: string;
  from_wilaya_name: string;
  firstname: string;
  familyname: string;
  contact_phone: string;
  address: string;
  to_commune_name: string;
  to_wilaya_name: string;
  product_list: string;
  price: number;
  do_insurance?: boolean;
  declared_value: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  freeshipping: boolean;
  is_stopdesk: boolean;
  stopdesk_id?: string; // 🎯 Required only if is_stopdesk is true
  has_exchange: boolean;
  product_to_collect?: string; // 🎯 Required only if has_exchange is true
  economic?: boolean;
}

// 📦 Full request: an array of parcels (for bulk or single)
export type YalidineBulkCreateParcelsRequest = YalidineCreateParcelRequest[];

// ✅ Success shape for a single parcel in the response
export interface YalidineCreateParcelResponseSuccess {
  success: true;
  order_id: string;
  tracking: string;
  import_id: number;
  label: string;
  labels: string;
  message: string; // usually empty
}

// ❌ Error shape for a single parcel in the response
export interface YalidineCreateParcelResponseError {
  success: false;
  order_id: string;
  tracking: null;
  import_id: null;
  label: null;
  labels: null;
  message: string; // explanation of what failed
}

// 🔁 Final response: object where each key is the order_id of the parcel
export type YalidineCreateParcelsResponse = Record<
  string,
  YalidineCreateParcelResponseSuccess | YalidineCreateParcelResponseError
>;
