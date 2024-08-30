import { AttesterOppdragRequest } from "../api/models/AttesterOppdragRequest";
import { LinjeEndring } from "../components/detaljer/DetaljerTabell";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";
import { norskDatoTilIsoDato } from "./DatoUtil";

export function createRequestPayload(
  oppdragsdetaljer: OppdragsDetaljer[],
  selectedRows: number[],
  oppdragsId: number,
  changes: { [linjeId: number]: LinjeEndring },
): AttesterOppdragRequest {
  const linjer = oppdragsdetaljer
    .filter(
      (linje) =>
        selectedRows.includes(linje.linjeId) &&
        (changes[linje.linjeId]?.activelyChangedDatoUgyldigFom ||
          changes[linje.linjeId]?.suggestedDatoUgyldigFom),
    )
    .map((linje) => ({
      linjeId: Number(linje.linjeId),
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

  return {
    oppdragsId: oppdragsId,
    linjer: linjer,
  };
}
