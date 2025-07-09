// ✅ Query params you can use with GET /v1/parcels
export interface YalidineGetParcelsQueryParams {
  tracking?: string; // single or comma-separated
  order_id?: string;
  import_id?: number;
  to_wilaya_id?: number;
  to_commune_name?: string;
  is_stopdesk?: boolean;
  is_exchange?: boolean;
  has_exchange?: boolean;
  economic?: boolean;
  freeshipping?: boolean;
  date_creation?: string; // YYYY-MM-DD or YYYY-MM-DD,YYYY-MM-DD
  date_last_status?: string; // same as above
  payment_status?: YalidinePaymentStatus;
  last_status?: string; // comma-separated values
  fields?: string; // comma-separated fields
  page?: number;
  page_size?: number;
  order_by?: YalidineOrderBy;
  asc?: null;
  desc?: null;
}

// ✅ Possible response if request is successful
export interface YalidineGetParcelsResponseSuccess {
  has_more: boolean;
  total_data: number;
  data: YalidineParcel[];
  links: {
    self: string;
    next: string;
  };
}

// ❌ Response if something fails (confirmed by real API responses)
export interface YalidineGetParcelsResponseError {
  error: {
    message: string;
    code: number;
    description: string;
  };
}

// 🔁 Union of success and error responses
export type YalidineParcelsResponse
  = | YalidineGetParcelsResponseSuccess
    | YalidineGetParcelsResponseError;

// 📦 One parcel object
export interface YalidineParcel {
  tracking: string;
  order_id: string;
  firstname: string;
  familyname: string;
  contact_phone: string;
  address: string;
  stopdesk_id: number | null;
  stopdesk_name: string | null;
  from_wilaya_id: number;
  from_wilaya_name: string;
  to_commune_name: string;
  to_wilaya_id: number;
  to_wilaya_name: string;
  product_list: string;
  price: number;
  do_insurance: boolean | 0 | 1;
  declared_value: number;
  length: number;
  height: number;
  width: number;
  weight: number;
  delivery_fee: number;
  freeshipping: boolean | 0 | 1;
  import_id: number;
  date_creation: string;
  date_expedition: string | null;
  date_last_status: string;
  last_status: YalidineParcelStatus;
  taxe_percentage: number;
  taxe_from: number;
  taxe_retour: number;
  parcel_type: YalidineParcelType;
  parcel_sub_type: YalidineParcelSubType | null;
  has_receipt: boolean | 0 | 1 | null;
  has_recouvrement: boolean | 0 | 1;
  current_center_id: number | null;
  current_center_name: string | null;
  current_wilaya_id: number | null;
  current_wilaya_name: string | null;
  current_commune_id: number | null;
  current_commune_name: string | null;
  payment_status: YalidinePaymentStatus;
  payment_id: string | null;
  has_exchange: boolean | 0 | 1;
  product_to_collect: string | null;
  economic: boolean | 0 | 1;
  label: string;
  pin: string;
  qr_text: string;
}

// 🔠 Enum: status of the parcel
export type YalidineParcelStatus
  = | "Pas encore expédié"
    | "A vérifier"
    | "En préparation"
    | "Pas encore ramassé"
    | "Prêt à expédier"
    | "Ramassé"
    | "Bloqué"
    | "Débloqué"
    | "Transfert"
    | "Expédié"
    | "Centre"
    | "En localisation"
    | "Vers Wilaya"
    | "Reçu à Wilaya"
    | "En attente du client"
    | "Prêt pour livreur"
    | "Sorti en livraison"
    | "En attente"
    | "En alerte"
    | "Tentative échouée"
    | "Livré"
    | "Echèc livraison"
    | "Retour vers centre"
    | "Retourné au centre"
    | "Retour transfert"
    | "Retour groupé"
    | "Retour à retirer"
    | "Retour vers vendeur"
    | "Retourné au vendeur"
    | "Alerte résolue"
    | "Echange échoué";

// 🔠 Enum: payment status
export type YalidinePaymentStatus
  = | "not-ready"
    | "ready"
    | "receivable"
    | "payed";

// 🔠 Enum: parcel type
export type YalidineParcelType = "classic" | "ecommerce" | "multiseller";

// 🔠 Enum: parcel sub type
export type YalidineParcelSubType
  = | "accuse"
    | "exchange"
    | "rcc"
    | "rccback"
    | "sm";

// 🔠 Enum: sort by fields
export type YalidineOrderBy
  = | "date_creation"
    | "date_last_status"
    | "tracking"
    | "order_id"
    | "import_id"
    | "to_wilaya_id"
    | "to_commune_id"
    | "last_status";
