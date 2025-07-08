export interface EcotrackShipParcelRequest {
  tracking: string;
  ask_collection?: 0 | 1; // 1 = request pickup, 0 = no pickup
}

export interface EcotrackShipParcelResponseSuccess {
  success: true;
  message: string;
}

export interface EcotrackShipParcelResponseError {
  message: string;
  errors: Record<string, string[]>;
}

export type EcotrackShipParcelResponse =
  | EcotrackShipParcelResponseError
  | EcotrackShipParcelResponseSuccess;
