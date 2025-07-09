import { z } from "zod";
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface CompanyMetaData {
  provider: Provider;
  active: boolean;
  baseUrl: string;
}

export type Actions = {
  [K in Provider]: ProviderActions;
};

export type ProviderActions = {
  [key: string]: {
    endpoint: string;
    method: HttpMethod;
  };
};
export type ActionMetaData = {
  endpoint: string;
  method: HttpMethod;
};
export const providerSchema = z.enum(["ecotrack", "yalidine", "noest"]);
export type Provider = z.infer<typeof providerSchema>;
