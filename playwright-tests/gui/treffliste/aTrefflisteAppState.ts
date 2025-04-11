import { AppState } from "../../../src/store/AppState";
import { AttestertStatus } from "../../../src/types/schema/AttestertStatus";

const state: { state: AppState; version: number } = {
  state: {
    gjelderNavn: "",
    oppdragDtoList: [
      {
        ansvarssted: "1337",
        antAttestanter: 1,
        navnFaggruppe: "Selveste faggruppen",
        navnFagomraade: "Det hemmelige fagområdet",
        fagSystemId: "666-98769876",
        oppdragGjelderId: "98765498765",
        kodeFaggruppe: "FAGGRUPPEN",
        kodeFagomraade: "HEMMELIG",
        kostnadssted: "7777",
        oppdragsId: 98769876,
        erSkjermetForSaksbehandler: true,
        hasWriteAccess: true,
      },
      {
        ansvarssted: "1337",
        antAttestanter: 1,
        navnFaggruppe: "Selveste faggruppen",
        navnFagomraade: "Selveste fagområdet",
        fagSystemId: "666-67896789",
        oppdragGjelderId: "12345612345",
        kodeFaggruppe: "FAGGRUPPEN",
        kodeFagomraade: "FAGOMRÅDET",
        kostnadssted: "6789",
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
