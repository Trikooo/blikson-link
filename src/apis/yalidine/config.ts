import type { ProviderActions } from "../../types/config-types";

export const yalidineActions: ProviderActions = {
  getParcels: {
    endpoint: "/v1/parcels",
    method: "GET",
  },
  bulkCreateParcels: {
    endpoint: "/v1/parcels",
    method: "POST",
  },
  updateParcel: {
    endpoint: "/v1/parcels",
    method: "PATCH",
  },
  deleteParcel: {
    endpoint: "/v1/parcels",
    method: "DELETE",
  },
  getTrackingInfo: {
    endpoint: "/v1/histories",
    method: "GET",
  },
  getCenters: {
    endpoint: "/v1/centers",
    method: "GET",
  },
  getCommunes: {
    endpoint: "/v1/communes",
    method: "GET",
  },
  getWilayas: {
    endpoint: "/v1/wilayas",
    method: "GET",
  },
  getFees: {
    endpoint: "/v1/fees",
    method: "GET",
  },
};
