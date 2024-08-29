import { LinjeEndring } from "../components/detaljer/DetaljerTabell";
import { OppdaterAttestasjon } from "../types/OppdaterAttestasjon";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";

export function createRequestPayload(
  oppdragsdetaljer: OppdragsDetaljer[],
  selectedRows: number[],
  gjelderId: string,
  fagOmraade: string,
  oppdragsId: number,
  brukerId: string,
  kjorIdag: boolean,
  changes: { [linjeId: number]: LinjeEndring },
): OppdaterAttestasjon {
  const LinjeTab = oppdragsdetaljer
    .filter(
      (linje) =>
        selectedRows.includes(linje.linjeId) &&
        (changes[linje.linjeId]?.activelyChangedDatoUgyldigFom ||
          changes[linje.linjeId]?.suggestedDatoUgyldigFom),
    )
    .map((linje) => ({
      linjeId: linje.linjeId,
      attestantId: linje.attestant || "",
      datoUgyldigFom: !linje.attestant
        ? ""
        : changes[linje.linjeId]?.activelyChangedDatoUgyldigFom ||
          changes[linje.linjeId]?.suggestedDatoUgyldigFom ||
          linje.datoUgyldigFom ||
          "",
    }));

  const payload: OppdaterAttestasjon = {
    gjelderId: gjelderId,
    fagOmraade: fagOmraade,
    oppdragsId: oppdragsId,
    brukerId: brukerId,
    kjorIdag: kjorIdag,
    linjer: LinjeTab,
  };

  return payload;
}
