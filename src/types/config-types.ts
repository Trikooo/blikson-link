export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface Company {
  provider: Provider;
  active: boolean;
  endpoint: string;
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

import { z } from "zod";

export const providerSchema = z.enum(["ecotrack", "yalidine", "noest"]);
export type Provider = z.infer<typeof providerSchema>;
