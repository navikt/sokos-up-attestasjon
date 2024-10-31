import { AppState } from "../../src/store/AppState";

const state: { state: AppState; version: number } = {
  state: {
    gjelderNavn: "Navn Fra Treffliste AppState",
    storedOppdragList: [
      {
        ansvarsSted: "1337",
        antallAttestanter: 1,
        fagGruppe: "HELSETJENESTER FRIKORT TAK 1 OG 2",
        fagOmraade: "Egenandelsrefusjon frikort tak 1",
        fagSystemId: "12344321",
        gjelderId: "12345612345",
        kodeFagGruppe: "FRIKORT",
        kodeFagOmraade: "FRIKORT1",
        kostnadsSted: "2360",
        oppdragsId: 25798519,
        erSkjermetForSaksbehandler: false,
      },
    ],
    storedSokeData: {
      gjelderId: "12345612345",
      attestertStatus: "false",
      fagSystemId: "",
    },
  },
  version: 0,
};
export default state;
