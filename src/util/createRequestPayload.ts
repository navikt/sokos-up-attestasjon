import { LinjeEndring } from "../components/detaljer/DetaljerTabell";
import { OppdaterAttestasjon } from "../types/OppdaterAttestasjon";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";
import { norskDatoTilIsoDato } from "./DatoUtil";

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
        : norskDatoTilIsoDato(
            changes[linje.linjeId]?.activelyChangedDatoUgyldigFom,
          ) ||
          norskDatoTilIsoDato(
            changes[linje.linjeId]?.suggestedDatoUgyldigFom,
          ) ||
          norskDatoTilIsoDato(linje.datoUgyldigFom) ||
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
