import { OppdragsDetaljerDTO } from "../../../src/types/OppdragsDetaljerDTO";
import { OppdragsLinjeDTO } from "../../../src/types/OppdragsLinjeDTO";

function generateNumbers(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

function anAttestasjon(n: number) {
  return {
    attestantId: n === 1 ? "A111111" : "B222222",
    datoUgyldigFom: "9999-12-31",
  };
}

function anOppdragslinjeDto(
  n: number,
  antallAttestasjoner: 0 | 1 | 2,
): OppdragsLinjeDTO {
  return {
    oppdragsLinje: {
      attestert: false,
      datoVedtakFom: `2024-${n.toString().padStart(2, "0")}-01`,
      datoVedtakTom: `2024-${n.toString().padStart(2, "0")}-31`,
      delytelseId: `${n}`,
      kodeKlasse: "KODEKLASSE",
      linjeId: n,
      oppdragsId: 98765432,
      sats: 1234.0 + n * 100,
      typeSats: "ENG",
      hovedkontonr: "123",
      underkontonr: "4567",
    },
    attestasjonList:
      antallAttestasjoner === 0
        ? []
        : generateNumbers(antallAttestasjoner).map((n) => anAttestasjon(n)),
  };
}

function oppdragsdetaljer(
  antallLinjer: number,
  antallAttestasjoner: 0 | 1 | 2,
  saksbehandlerIdent?: string,
): OppdragsDetaljerDTO {
  return {
    oppdragsLinjeList: generateNumbers(antallLinjer).map((n) =>
      anOppdragslinjeDto(n, antallAttestasjoner),
    ),
    saksbehandlerIdent: saksbehandlerIdent ?? "X31337",
  };
}

export default oppdragsdetaljer;
