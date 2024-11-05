import { AppState } from "../../../src/store/AppState";
import { SokeData } from "../../../src/types/SokeData";

export default {
  state: {
    storedSokeData: {
      gjelderId: "17508716508",
      fagSystemId: "2960",
      fagGruppe: { navn: "Arbeidsytelser", type: "ARBYT" },
      attestertStatus: "undefined",
    },
  },
  version: 0,
};

export function aStateWith(sokeData: Partial<SokeData>): {
  state: AppState;
  version: number;
} {
  return {
    state: {
      gjelderNavn: "",
      storedSokeData: { gjelderId: "", attestertStatus: "false", ...sokeData },
    },
    version: 0,
  };
}
