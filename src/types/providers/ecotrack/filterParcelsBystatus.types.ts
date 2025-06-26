// Request params
export interface GetOrdersByStatusQueryParams {
  trackings: string[]; // up to 100 tracking numbers
  status: EcotrackOrderStatus[]; // see type below
}

// Single order status result (keyed by tracking number)
export interface OrderStatusEntry {
  status: EcotrackOrderStatus;
  order_id: string;
  estimated_fee?: number; // undocumented field observed in real responses
}

// Full response from the status filtering endpoint
export interface GetOrdersByStatusResponse {
  current_page: number;
  data: Record<string, OrderStatusEntry>[];
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

// List of all possible statuses (based on their docs)
export type EcotrackOrderStatus =
  | "prete_a_expedier"
  | "en_ramassage"
  | "en_preparation_stock"
  | "vers_hub"
  | "en_hub"
  | "vers_wilaya"
  | "en_preparation"
  | "en_livraison"
  | "suspendu"
  | "livre_non_encaisse"
  | "encaisse_non_paye"
  | "paiements_prets"
  | "paye_et_archive"
  | "retour_chez_livreur"
  | "retour_transit_entrepot"
  | "retour_en_traitement"
  | "retour_recu"
  | "retour_archive"
  | "annule"
  | "all";
