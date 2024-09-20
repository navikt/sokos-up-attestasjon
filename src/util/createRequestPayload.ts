import { AttesterOppdragRequest } from "../api/models/AttesterOppdragRequest";
import { LinjeEndring } from "../components/detaljer/DetaljerTabell";
import { OppdragsLinje } from "../types/OppdragsDetaljer";
import { norskDatoTilIsoDato } from "./DatoUtil";

export function createRequestPayload(
  fagSystemId: string,
  kodeFagOmraade: string,
  gjelderId: string,
  oppdragsId: number,
  oppdragsdetaljer: OppdragsLinje[],
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
          const linje = oppdragsdetaljer.find(
            (l) => l.oppdragsLinje.linjeId == id,
          );
          const change = changes.find((c) => c.linjeId == id);

          if (!linje) return;

          return {
            linjeId: Number(linje.oppdragsLinje.linjeId),
            attestantIdent: linje.attestasjoner[0]?.attestant || undefined,
            datoUgyldigFom: !linje.oppdragsLinje.attestert
              ? undefined
              : norskDatoTilIsoDato(change?.activelyChangedDatoUgyldigFom) ||
                norskDatoTilIsoDato(change?.suggestedDatoUgyldigFom) ||
                norskDatoTilIsoDato(linje.attestasjoner[0]?.datoUgyldigFom) ||
                "",
          };
        })
        .filter((l) => !!l) ?? [],
  };
}
