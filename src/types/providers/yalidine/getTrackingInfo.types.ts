// 📦 Parcel History Entry
export interface YalidineParcelHistory {
  date_status: string; // e.g. "2022-12-17 01:48:09"
  tracking: string;
  status: YalidineParcelStatus;
  reason: YalidineParcelHistoryReason | "";
  center_id: number;
  center_name: string;
  wilaya_id: number;
  wilaya_name: string;
  commune_id: number;
  commune_name: string;
}

// 🔁 Query params for GET /v1/histories
export interface YalidineGetHistoriesQueryParams {
  tracking?: string; // single or comma-separated
  status?: YalidineParcelStatus; // optional filter
  date_status?: string; // YYYY-MM-DD or YYYY-MM-DD,YYYY-MM-DD
  reason?: YalidineParcelHistoryReason;
  fields?: string;
  page?: number;
  page_size?: number;
  order_by?: "date_status" | "tracking" | "status" | "reason";
  asc?: null;
  desc?: null;
}

// ✅ Success response for GET /v1/histories or /v1/histories/:tracking
export interface YalidineGetHistoriesResponseSuccess {
  has_more: boolean;
  total_data: number;
  data: YalidineParcelHistory[];
  links: {
    self: string;
    next?: string;
  };
}

// ❌ Error response
export interface YalidineGetHistoriesResponseError {
  error: {
    message: string;
    code: number;
    description: string;
  };
}

// 🔁 Combined response type
export type YalidineHistoriesResponse =
  | YalidineGetHistoriesResponseSuccess
  | YalidineGetHistoriesResponseError;

// 🔠 Enum: all possible parcel status values
export type YalidineParcelStatus =
  | "Pas encore expédié"
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
  | "Alerte résolue"
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
  | "Echange échoué";

// 🛑 Enum: reasons for delivery failure or hold
export type YalidineParcelHistoryReason =
  | "Téléphone injoignable"
  | "Client ne répond pas"
  | "Faux numéro"
  | "Client absent (reporté)"
  | "Client absent (échoué)"
  | "Annulé par le client"
  | "Commande double"
  | "Le client n'a pas commandé"
  | "Produit erroné"
  | "Produit manquant"
  | "Produit cassé ou défectueux"
  | "Client incapable de payer"
  | "Wilaya erronée"
  | "Commune erronée"
  | "Client no-show"
  | "Document manquant"
  | "Produit interdit"
  | "Produit dangereux"
  | "Fausse déclaration";
