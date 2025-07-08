import { EcotrackCreateParcelRequest } from "./create-parcel.types";

export interface EcotrackBulkCreateParcelsRequest {
  orders: Record<string, EcotrackCreateParcelRequest>;
}

export interface EcotrackBulkCreateParcelsResponseSuccessEntry {
  success: true;
  tracking: string;
}

export interface EcotrackBulkCreateParcelsResponseErrorEntry {
  [field: string]: string[]; // field name → list of error messages
}

export type EcotrackBulkCreateParcelsResultEntry =
  | EcotrackBulkCreateParcelsResponseSuccessEntry
  | EcotrackBulkCreateParcelsResponseErrorEntry;

export interface EcotrackBulkCreateParcelsResponse {
  results: Record<string, EcotrackBulkCreateParcelsResultEntry>;
}
