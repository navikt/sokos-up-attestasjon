import { AttesterOppdragRequest } from "../api/models/AttesterOppdragRequest";
import { StatefulLinje } from "../components/detaljer/DetaljerTabell";
import { norskDatoTilIsoDato } from "./DatoUtil";

export function createRequestPayload(
  fagSystemId: string,
  kodeFagOmraade: string,
  gjelderId: string,
  oppdragsId: number,
  changes: StatefulLinje[],
): AttesterOppdragRequest {
  return {
    oppdragsId,
    fagSystemId,
    kodeFagOmraade,
    gjelderId,
    linjer:
      changes
        .filter((le) => le.attester || le.fjern)
        .map((le) => {
          const linje = le.linje;

          const datoUgyldigFom = le.attester
            ? undefined
            : le.activelyChangedDatoUgyldigFom
              ? norskDatoTilIsoDato(le.activelyChangedDatoUgyldigFom)
              : le.suggestedDatoUgyldigFom
                ? norskDatoTilIsoDato(le.suggestedDatoUgyldigFom)
                : linje.attestasjoner[0]?.datoUgyldigFom
                  ? norskDatoTilIsoDato(linje.attestasjoner[0]?.datoUgyldigFom)
                  : "";

          return {
            linjeId: Number(linje.oppdragsLinje.linjeId),
            attestantIdent: linje.attestasjoner[0]?.attestant || undefined,
            datoUgyldigFom,
          };
        }) ?? [],
  };
}
