export interface EcotrackCreateParcelRequest {
  reference?: string;
  nom_client: string;
  telephone: string;
  telephone_2?: string;
  adresse: string;
  code_postal?: string;
  commune: string;
  code_wilaya: number;
  montant: number;
  remarque?: string;
  produit?: string;
  stock?: 0 | 1;
  quantite?: string; // only if stock === 1
  produit_a_recuperer?: string;
  boutique?: string;
  type: 1 | 2 | 3 | 4; // Livraison, Échange, PICKUP, Recouvrement
  stop_desk?: 0 | 1;
  weight?: number;
  fragile?: 0 | 1;
}
export interface EcotrackCreateParcelResponseSuccess {
  success: true;
  tracking: string;
}

export interface EcotrackCreateParcelResponseError {
  message: string;
  errors: Record<string, string[]>;
}
export type EcotrackCreateParcelResponse =
  | EcotrackCreateParcelResponseSuccess
  | EcotrackCreateParcelResponseError;