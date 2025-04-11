import { AppState } from "../../../src/store/AppState";
import { AttestertStatus } from "../../../src/types/schema/AttestertStatus";

const detaljerAppState: { state: AppState; version: number } = {
  state: {
    gjelderNavn: "Unused",
    oppdragDto: {
      ansvarssted: "1337",
      antAttestanter: 1,
      navnFaggruppe: "HELSETJENESTER FRIKORT TAK 1 OG 2",
      navnFagomraade: "Egenandelsrefusjon frikort tak 1",
      fagSystemId: "9876-5432-mock",
      oppdragGjelderId: "12345612345",
      kodeFaggruppe: "FRIKORT",
      kodeFagomraade: "FRIKORT1",
      kostnadssted: "8128",
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
  antAttestanter,
}: {
  antAttestanter: number;
}) {
  return {
    ...detaljerAppState,
    state: {
      ...detaljerAppState.state,
      oppdragDto: {
        ...detaljerAppState.state.oppdragDto,
        antAttestanter,
      },
    },
  };
}
