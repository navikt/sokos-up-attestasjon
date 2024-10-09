import { OppdragsLinje } from "../../types/OppdragsDetaljer";

export function enLinjePerAttestasjon(
  linje: OppdragsLinje,
  antallAttestanter: number,
  innloggetSaksbehandlerIdent: string,
): OppdragsLinje[] {
  const enLinjeForHverEksisterendeAttestasjon: OppdragsLinje[] =
    linje.attestasjoner.map((a) => ({
      ...linje,
      attestasjoner: [a],
    }));
  const enLinjeUtenAttestasjon: OppdragsLinje = {
    ...linje,
    attestasjoner: [],
  };

  return antallAttestanter > linje.attestasjoner.length &&
    !linje.attestasjoner.some(
      (a) => a.attestant === innloggetSaksbehandlerIdent,
    )
    ? [...enLinjeForHverEksisterendeAttestasjon, enLinjeUtenAttestasjon]
    : [...enLinjeForHverEksisterendeAttestasjon];
}
