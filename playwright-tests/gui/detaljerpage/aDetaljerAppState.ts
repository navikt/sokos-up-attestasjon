import { AppState } from "../../../src/store/AppState";
import { AttestertStatus } from "../../../src/types/schema/AttestertStatus";

type State = {
  state: AppState;
  version: number;
};

const detaljerAppState: State = {
  state: {
    gjelderNavn: "Unused",
    oppdrag: {
      ansvarsSted: "1337",
      antallAttestanter: 1,
      fagGruppe: "HELSETJENESTER FRIKORT TAK 1 OG 2",
      fagOmraade: "Egenandelsrefusjon frikort tak 1",
      fagSystemId: "9876-5432-mock",
      gjelderId: "12345612345",
      kodeFagGruppe: "FRIKORT",
      kodeFagOmraade: "FRIKORT1",
      kostnadsSted: "8128",
      oppdragsId: 98765432,
      erSkjermetForSaksbehandler: false,
      hasWriteAccess: true,
    },
    sokeData: {
      gjelderId: "",
      alternativer: AttestertStatus.ALLE,
      fagSystemId: "666-",
      fagGruppe: {
        navn: "Selveste faggruppen",
        type: "FAGGRUPPEN",
      },
    },
  },
  version: 0,
};
export default detaljerAppState;

export function detaljerStateWith({
  antallAttestanter,
}: {
  antallAttestanter: number;
}) {
  return {
    ...detaljerAppState,
    state: {
      ...detaljerAppState.state,
      oppdrag: {
        ...detaljerAppState.state.oppdrag,
        antallAttestanter,
      },
    },
  };
}
