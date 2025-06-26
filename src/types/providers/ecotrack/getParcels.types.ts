export interface GetParcelsQueryParams {
  page?: number;
  start_date?: string; // format: YYYY-MM-DD
  end_date?: string; // format: YYYY-MM-DD
}

export interface EcotrackParcel {
  tracking: string;
  reference: string | null;
  client: string;
  phone: string;
  phone_2: string | null;
  adresse: string;
  stop_desk: number;
  commune_id: number;
  wilaya_id: number;
  montant: string;
  tarif_prestation: string;
  tarif_retour: string;
  type_id: number;
  created_at: string;
  payment_id: number | null;
  return_id: number | null;
  process_state_id: number;
  livred_at: string | null;
  exchanged_at: string | null;
  return_asked_at: string | null;
  last_updated_at: string;
  driver_name: string | null;
  driver_phone: string | null;
  status: string;
  global_status: string;
  status_reason: {
    remarque: string;
    commentaires: string;
    station: string;
    livreur: string;
    created_at: string;
    tracking: string;
  }[];
}

export interface GetParcelsResponseSuccess {
  current_page: number;
  data: EcotrackParcel[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface GetParcelsResponseError {
  message: string;
  errors: Record<string, string[]>;
}

export type GetOrdersResponse =
  | GetParcelsResponseSuccess
  | GetParcelsResponseError;
