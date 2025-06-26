export interface ShipParcelRequest {
  tracking: string;
  ask_collection?: 0 | 1; // 1 = request pickup, 0 = no pickup
}

export interface ShipParcelResponseSuccess {
  success: true;
  message: string;
}

export interface ShipParcelResponseError {
  message: string;
  errors: Record<string, string[]>;
}

export type ShipParcelResponse =
  | ShipParcelResponseError
  | ShipParcelResponseSuccess;
