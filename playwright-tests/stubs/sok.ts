import { Oppdrag } from "../../src/types/Oppdrag";

const sok: Oppdrag[] = [
  {
    ansvarsSted: "1337",
    antallAttestanter: 2,
    fagGruppe: "Pensjoner",
    fagOmraade: "Avtalefestet pensjon manuell postering",
    fagSystemId: "detteErEtLiteOppdrag",
    gjelderId: "12345678901",
    kodeFagGruppe: "PEN",
    kodeFagOmraade: "MPENAFP",
    kostnadsSted: "8128",
    oppdragsId: 87654321,
    erSkjermetForSaksbehandler: false,
  },
  {
    ansvarsSted: "1234",
    antallAttestanter: 2,
    fagGruppe: "Memoposteringer pensjon",
    fagOmraade: "Kontoplan pensjon",
    fagSystemId: "detteErEtLiteOppdragTil",
    gjelderId: "12345678901",
    kodeFagGruppe: "PENPOST",
    kodeFagOmraade: "MPENALLE",
    kostnadsSted: "5972",
    oppdragsId: 98765432,
    erSkjermetForSaksbehandler: false,
  },
];

export default sok;
