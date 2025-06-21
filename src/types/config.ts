export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type Provider = "ecotrack" | "yalidine" | "noest";

export interface Company {
  provider: Provider;
  active: boolean;
  endpoint: string;
}

export type Actions = {
  [K in Provider]: {
    [key: string]: {
      endpoint: string;
      method: HttpMethod;
    };
  };
};
