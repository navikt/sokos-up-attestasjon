import { AppState } from "../../../src/store/AppState";
import { AttestertStatus } from "../../../src/types/schema/AttestertStatus";

const state: { state: AppState; version: number } = {
  state: {
    gjelderNavn: "",
    oppdragList: [
      {
        ansvarsSted: "1337",
        antallAttestanter: 1,
        fagGruppe: "Selveste faggruppen",
        fagOmraade: "Det hemmelige fagområdet",
        fagSystemId: "666-98769876",
        gjelderId: "98765498765",
        kodeFagGruppe: "FAGGRUPPEN",
        kodeFagOmraade: "HEMMELIG",
        kostnadsSted: "7777",
        oppdragsId: 98769876,
        erSkjermetForSaksbehandler: true,
        hasWriteAccess: true,
      },
      {
        ansvarsSted: "1337",
        antallAttestanter: 1,
        fagGruppe: "Selveste faggruppen",
        fagOmraade: "Selveste fagområdet",
        fagSystemId: "666-67896789",
        gjelderId: "12345612345",
        kodeFagGruppe: "FAGGRUPPEN",
        kodeFagOmraade: "FAGOMRÅDET",
        kostnadsSted: "6789",
        oppdragsId: 67896789,
        erSkjermetForSaksbehandler: false,
        hasWriteAccess: true,
      },
    ],
    sokeData: {
      gjelderId: "",
      alternativer: AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE,
      fagSystemId: "666-",
      fagGruppe: {
        navn: "Selveste faggruppen",
        type: "FAGGRUPPEN",
      },
    },
  },
  version: 0,
};
export default state;
