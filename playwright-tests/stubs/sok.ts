import { OppdragDTOList } from "../../src/types/Oppdrag";

const sok: OppdragDTOList = [
  {
    ansvarssted: "1337",
    antAttestanter: 2,
    navnFaggruppe: "Pensjoner",
    navnFagomraade: "Avtalefestet pensjon manuell postering",
    fagSystemId: "detteErEtLiteOppdrag",
    oppdragGjelderId: "12345678901",
    kodeFaggruppe: "PEN",
    kodeFagomraade: "MPENAFP",
    kostnadssted: "8128",
    oppdragsId: 87654321,
    erSkjermetForSaksbehandler: false,
    hasWriteAccess: true,
  },
  {
    ansvarssted: "1234",
    antAttestanter: 2,
    navnFaggruppe: "Memoposteringer pensjon",
    navnFagomraade: "Kontoplan pensjon",
    fagSystemId: "detteErEtLiteOppdragTil",
    oppdragGjelderId: "12345678901",
    kodeFaggruppe: "PENPOST",
    kodeFagomraade: "MPENALLE",
    kostnadssted: "5972",
    oppdragsId: 98765432,
    erSkjermetForSaksbehandler: false,
    hasWriteAccess: true,
  },
];

export default sok;
