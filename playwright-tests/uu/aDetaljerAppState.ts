import { AppState } from "../../src/store/AppState";

const detaljerAppState: { state: AppState } = {
  state: {
    gjelderNavn: "Mikkel Rev",
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
  },
};

export default detaljerAppState;
