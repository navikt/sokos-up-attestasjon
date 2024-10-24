import { Attestasjonlinje } from "../../types/Attestasjonlinje";
import { OppdragsDetaljer, OppdragsLinje } from "../../types/OppdragsDetaljer";

function splittOgLeggTilEkstraLinjeForManuellePosteringer(
  oppdragslinje: OppdragsLinje,
  antallAttestanter: number,
  innloggetSaksbehandlerIdent: string,
): Attestasjonlinje[] {
  const enLinjeUtenAttestasjon: Attestasjonlinje = {
    kodeKlasse: oppdragslinje.oppdragsLinje.kodeKlasse,
    delytelseId: oppdragslinje.oppdragsLinje.delytelseId,
    sats: oppdragslinje.oppdragsLinje.sats,
    typeSats: oppdragslinje.oppdragsLinje.typeSats,
    datoVedtakFom: oppdragslinje.oppdragsLinje.datoVedtakFom,
    datoVedtakTom: oppdragslinje.oppdragsLinje.datoVedtakTom,
    oppdragsId: oppdragslinje.oppdragsLinje.oppdragsId,
    linjeId: oppdragslinje.oppdragsLinje.linjeId,
    properties: {
      activelyChangedDatoUgyldigFom: "",
      attester: false,
      fjern: false,
      suggestedDatoUgyldigFom: "",
      vises: true,
      dateError: "",
    },
  };

  const enLinjeForHverEksisterendeAttestasjon: Attestasjonlinje[] =
    oppdragslinje.attestasjoner.map((attestasjon) => ({
      ...enLinjeUtenAttestasjon,
      attestant: attestasjon.attestant,
      datoUgyldigFom: attestasjon.datoUgyldigFom,
    }));

  const sjekkAntallAttestanterOgInnloggetSaksbehandler =
    antallAttestanter > oppdragslinje.attestasjoner.length &&
    !oppdragslinje.attestasjoner.some(
      (attestasjon) => attestasjon.attestant === innloggetSaksbehandlerIdent,
    );

  if (sjekkAntallAttestanterOgInnloggetSaksbehandler) {
    return [...enLinjeForHverEksisterendeAttestasjon, enLinjeUtenAttestasjon];
  } else {
    return [...enLinjeForHverEksisterendeAttestasjon];
  }
}

export function tranformToAttestasjonlinje(
  oppdragsdetaljer: OppdragsDetaljer,
  antallAttestanter: number,
): Attestasjonlinje[] {
  return oppdragsdetaljer.linjer
    .map((oppdragslinje) =>
      splittOgLeggTilEkstraLinjeForManuellePosteringer(
        oppdragslinje,
        antallAttestanter,
        oppdragsdetaljer.saksbehandlerIdent,
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
