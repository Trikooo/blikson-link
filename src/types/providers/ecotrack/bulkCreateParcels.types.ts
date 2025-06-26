import { CreateParcelRequest } from "./createParcel.types";

export interface bulkCreateParcelsRequest {
  orders: Record<string, CreateParcelRequest>;
}

export interface BulkCreateParcelsResponseSuccessEntry {
  success: true;
  tracking: string;
}

export interface BulkCreateParcelsResponseErrorEntry {
  [field: string]: string[]; // field name → list of error messages
}

export type BulkCreateParcelsResultEntry =
  | BulkCreateParcelsResponseSuccessEntry
  | BulkCreateParcelsResponseErrorEntry;

export interface BulkCreateParcelsResponse {
  results: Record<string, BulkCreateParcelsResultEntry>;
}
