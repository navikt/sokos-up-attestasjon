import { AttesterOppdragRequest } from "../api/models/AttesterOppdragRequest";
import { LinjeEndring } from "../components/detaljer/DetaljerTabell";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";
import { norskDatoTilIsoDato } from "./DatoUtil";

export function createRequestPayload(
  fagSystemId: string,
  kodeFagOmraade: string,
  gjelderId: string,
  oppdragsId: number,
  oppdragsdetaljer: OppdragsDetaljer[],
  selectedRows: number[],
  changes: LinjeEndring[],
): AttesterOppdragRequest {
  return {
    oppdragsId: oppdragsId,
    fagSystemId: fagSystemId,
    kodeFagOmraade: kodeFagOmraade,
    gjelderId: gjelderId,
    linjer:
      selectedRows
        .map((id) => {
          const linje = oppdragsdetaljer.find((l) => l.linjeId == id);
          const change = changes.find((c) => c.linjeId == id);

          if (!linje) return;

          return {
            linjeId: Number(linje.linjeId),
            attestantIdent: linje.attestant || "",
            datoUgyldigFom: !linje.attestant
              ? undefined
              : norskDatoTilIsoDato(change?.activelyChangedDatoUgyldigFom) ||
                norskDatoTilIsoDato(change?.suggestedDatoUgyldigFom) ||
                norskDatoTilIsoDato(linje.datoUgyldigFom) ||
                "",
          };
        })
        .filter((l) => !!l) ?? [],
  };
}
