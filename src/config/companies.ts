import type { CompanyMetaData } from "../types/config-types";

export const companies: Record<string, CompanyMetaData> = {
  yalidine: {
    provider: "yalidine",
    active: true,
    baseUrl: "https://api.yalidine.app/api/v1",
  },
  guepex: {
    provider: "yalidine",
    active: true,
    baseUrl: "https://api.yalidine.app/api/v1",
  },
  easyAndSpeed: {
    provider: "yalidine",
    active: true,
    baseUrl: "https://api.yalidine.app/api/v1",
  },
  zimouExpress: {
    provider: "yalidine",
    active: true,
    baseUrl: "https://api.yalidine.app/api/v1",
  },
  weCanServices: {
    provider: "yalidine",
    active: true,
    baseUrl: "https://api.yalidine.app/api/v1",
  },
  speedMail: {
    provider: "yalidine",
    active: true,
    baseUrl: "https://api.yalidine.app/api/v1",
  },
  yalitec: {
    provider: "yalidine",
    active: true,
    baseUrl: "https://api.yalitec.app/api/v1",
  },
  anderson: {
    provider: "ecotrack",
    active: true,
    baseUrl: "https://anderson-ecommerce.ecotrack.dz/api/v1",
  },
};
