import { z } from "zod";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface CompanyMetadata {
  provider: Provider;
  active: boolean;
  baseUrl: string;
}

export type Actions = {
  [K in Provider]: ProviderActions;
};

export interface ProviderActions {
  [key: string]: {
    endpoint: string;
    method: HttpMethod;
  };
}
export interface ActionMetadata {
  endpoint: string;
  method: HttpMethod;
}
export const providerSchema = z.enum(["ecotrack", "yalidine", "noest"]);
export type Provider = z.infer<typeof providerSchema>;
