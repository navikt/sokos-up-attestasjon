import { OppdragsDetaljerDTO } from "../../src/types/OppdragsDetaljerDTO";

const oppdragsDetaljerDto: OppdragsDetaljerDTO = {
  oppdragsLinjeList: [
    {
      oppdragsLinje: {
        attestert: false,
        datoVedtakFom: "2024-05-01",
        datoVedtakTom: "2024-05-31",
        delytelseId: "1",
        kodeKlasse: "SPREFAGFER-IOP",
        linjeId: 1,
        oppdragsId: 98765432,
        sats: 1234.0,
        typeSats: "ENG",
        hovedkontonr: "123",
        underkontonr: "4567",
      },
      attestasjonList: [
        {
          attestantId: "G133837",
          datoUgyldigFom: "9999-12-31",
        },
      ],
    },
  ],
  saksbehandlerIdent: "H135685",
};

export default oppdragsDetaljerDto;
