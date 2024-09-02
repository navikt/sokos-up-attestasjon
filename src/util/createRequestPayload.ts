import { AttesterOppdragRequest } from "../api/models/AttesterOppdragRequest";
import { LinjeEndring } from "../components/detaljer/DetaljerTabell";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";
import { norskDatoTilIsoDato } from "./DatoUtil";

export function createRequestPayload(
  fagSystemId: string,
  navnFagOmraade: string,
  oppdragGjelderId: string,
  oppdragsId: number,
  oppdragsdetaljer: OppdragsDetaljer[],
  selectedRows: number[],
  changes: LinjeEndring[],
): AttesterOppdragRequest {
  return {
    oppdragsId: oppdragsId,
    fagSystemId: fagSystemId,
    navnFagOmraade: navnFagOmraade,
    oppdragGjelderId: oppdragGjelderId,
    linjer:
      selectedRows
        .map((id) => {
          const linje = oppdragsdetaljer.find((l) => l.linjeId == id);
          const change = changes.find((c) => c.linjeId == id);

          if (!linje) return;

          return {
            linjeId: Number(linje.linjeId),
            attestantId: linje.attestant || "",
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
