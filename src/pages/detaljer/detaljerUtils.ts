import {
  Attestasjonlinje,
  AttestasjonlinjeList,
} from "../../types/Attestasjonlinje";
import { OppdragsDetaljerDTO } from "../../types/OppdragsDetaljerDTO";
import { OppdragsLinjeDTO } from "../../types/OppdragsLinjeDTO";
import { AttestertStatus } from "../../types/schema/AttestertStatus";

function splittOgLeggTilEkstraLinjeForManuellePosteringer(
  oppdragslinjeDto: OppdragsLinjeDTO,
  antallAttestanter: number,
  innloggetSaksbehandlerIdent: string,
): AttestasjonlinjeList {
  const enLinjeUtenAttestasjon: Attestasjonlinje = {
    attestert: oppdragslinjeDto.oppdragsLinje.attestert,
    kodeKlasse: oppdragslinjeDto.oppdragsLinje.kodeKlasse,
    delytelseId: oppdragslinjeDto.oppdragsLinje.delytelseId,
    sats: oppdragslinjeDto.oppdragsLinje.sats,
    typeSats: oppdragslinjeDto.oppdragsLinje.typeSats,
    datoVedtakFom: oppdragslinjeDto.oppdragsLinje.datoVedtakFom,
    datoVedtakTom: oppdragslinjeDto.oppdragsLinje.datoVedtakTom,
    oppdragsId: oppdragslinjeDto.oppdragsLinje.oppdragsId,
    linjeId: oppdragslinjeDto.oppdragsLinje.linjeId,
    kontonummer: `${oppdragslinjeDto.oppdragsLinje.hovedkontonr ?? ""}${oppdragslinjeDto.oppdragsLinje.underkontonr ?? ""}`,
    kid: oppdragslinjeDto.oppdragsLinje.kid,
    skyldner: oppdragslinjeDto.oppdragsLinje.skyldnerId,
    refusjonsid: oppdragslinjeDto.oppdragsLinje.refunderesId,
    utbetalesTil: oppdragslinjeDto.oppdragsLinje.utbetalesTilId,
    grad: oppdragslinjeDto.oppdragsLinje.grad,
    properties: {
      activelyChangedDatoUgyldigFom: "",
      attester: false,
      fjern: false,
      suggestedDatoUgyldigFom: "",
      vises: true,
      dateError: "",
    },
  };

  const enLinjeForHverEksisterendeAttestasjon: AttestasjonlinjeList =
    oppdragslinjeDto.attestasjonList.map((attestasjon) => ({
      ...enLinjeUtenAttestasjon,
      attestant: attestasjon.attestantId,
      datoUgyldigFom: attestasjon.datoUgyldigFom,
    }));

  const sjekkAntallAttestanterOgInnloggetSaksbehandler =
    antallAttestanter > oppdragslinjeDto.attestasjonList.length &&
    !oppdragslinjeDto.attestasjonList.some(
      (attestasjon) => attestasjon.attestantId === innloggetSaksbehandlerIdent,
    );

  if (sjekkAntallAttestanterOgInnloggetSaksbehandler) {
    return [...enLinjeForHverEksisterendeAttestasjon, enLinjeUtenAttestasjon];
  } else {
    return [...enLinjeForHverEksisterendeAttestasjon];
  }
}

export function tranformToAttestasjonlinje(
  oppdragsdetaljerDto: OppdragsDetaljerDTO,
  antallAttestanter: number,
): AttestasjonlinjeList {
  return oppdragsdetaljerDto.oppdragsLinjeList
    .map((oppdragslinje) =>
      splittOgLeggTilEkstraLinjeForManuellePosteringer(
        oppdragslinje,
        antallAttestanter,
        oppdragsdetaljerDto.saksbehandlerIdent,
      ),
    )
    .flatMap((linjer) =>
      linjer.map((linje, index) => ({
        ...linje,
        properties: {
          ...linje.properties,
          vises: index == 0,
        },
      })),
    );
}

export const filterLinjerByAttestertStatus = (
  linje: OppdragsLinjeDTO,
  status?: string,
): boolean => {
  if (!status) return true;

  switch (status) {
    case AttestertStatus.ATTESTERT:
      return linje.oppdragsLinje.attestert;
    case AttestertStatus.IKKE_FERDIG_ATTESTERT_EKSL_EGNE:
    case AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE:
      return !linje.oppdragsLinje.attestert;
    default:
      return true;
  }
};
