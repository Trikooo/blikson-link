import type { Actions } from "../types/config-types";
import { ecotrackActions } from "../apis/ecotrack/config";

export const actions: Actions = {
  ecotrack: ecotrackActions,
  yalidine: {
    createParcel: {
      endpoint: "...",
      method: "POST",
    },
  },
  noest: {
    createParcel: {
      endpoint: "...",
      method: "POST",
    },
  },
};
