import { AppState } from "../../../src/store/AppState";
import { SokeData } from "../../../src/types/SokeData";
import { AttestertStatus } from "../../../src/types/schema/AttestertStatus";

export default {
  state: {
    storedSokeData: {
      gjelderId: "17508716508",
      fagSystemId: "2960",
      fagGruppe: { navn: "Arbeidsytelser", type: "ARBYT" },
      attestertStatus: "alle",
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
      sokeData: {
        gjelderId: "",
        alternativer: AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE,
        ...sokeData,
      },
    },
    version: 0,
  };
}
