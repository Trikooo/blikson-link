export interface UpdateParcelRequest {
  tracking: string;
  reference?: string;
  client?: string;
  tel?: string;
  tel2?: string;
  adresse?: string;
  code_postal?: string;
  commune?: string;
  wilaya?: number; // code from 1 to 58
  montant?: number; // cash to collect (COD), includes shipping
  remarque?: string;
  product?: string;
  boutique?: string;
  type?: 1 | 2 | 3 | 4; // 1=Livraison, 2=Échange, 3=Pickup, 4=Recouvrement
  stop_desk?: 0 | 1; // 0=home delivery, 1=relay point
  fragile?: 0 | 1; // 1=fragile, 0=not fragile
  gps_link?: string; // optional Google Maps link or similar
}

export interface UpdateParcelResponseSuccess {
  success: true;
  message: string;
}

export interface UpdateParcelResponseError {
  success: false;
  error: number;
  message: string;
}

export type UpdateParcelResponse =
  | UpdateParcelResponseError
  | UpdateParcelResponseSuccess;
