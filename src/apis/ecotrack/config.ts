import type { ProviderActions } from "@/types/config-types";

export const ecotrackActions: ProviderActions = {
  getParcels: {
    endpoint: "/api/v1/get/orders",
    method: "GET",
  },
  createParcel: {
    endpoint: "/api/v1/create/order",
    method: "POST",
  },
  bulkCreateParcels: {
    endpoint: "/api/v1/create/orders",
    method: "POST",
  },
  updateParcel: {
    endpoint: "/api/v1/update/order",
    method: "POST",
  },
  deleteParcel: {
    endpoint: "/api/v1/delete/order",
    method: "DELETE",
  },
  // Expedier
  shipParcel: {
    endpoint: "/api/v1/valid/order",
    method: "POST",
  },
  getLabel: {
    endpoint: "/api/v1/get/order/label",
    method: "GET",
  },
  addTrackingNote: {
    endpoint: "/api/v1/add/maj",
    method: "POST",
  },
  getTrackingNotes: {
    endpoint: "/api/v1/get/maj",
    method: "GET",
  },
  requestReturn: {
    endpoint: "/api/v1/ask/for/order/return",
    method: "POST",
  },
  getTrackingInfo: {
    endpoint: "/api/v1/get/tracking/info",
    method: "GET",
  },
  filterParcelsByStatus: {
    endpoint: "/api/v1/get/orders/status",
    method: "GET",
  },
  getWilayas: {
    endpoint: "/api/v1/get/wilayas",
    method: "GET",
  },
  getCommunes: {
    endpoint: "/api/v1/get/communes",
    method: "GET",
  },
  getFees: {
    endpoint: "/api/v1/get/fees",
    method: "GET",
  },
  checkRateLimit: {
    endpoint: "/api/v1/",
    method: "GET",
  },
};
