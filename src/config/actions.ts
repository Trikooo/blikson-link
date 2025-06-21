import { ecotrackActions } from "../apis/ecotrack/config";
import { Actions } from "../types/config";

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
