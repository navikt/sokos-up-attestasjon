import { StatefulLinje } from "../pages/detaljer/DetaljerTabell";
import { Oppdrag } from "../types/Oppdrag";
import { SokeParameter } from "../types/SokeParameter";
import { norskDatoTilIsoDato } from "../util/DatoUtil";
import { BASE_URI, axiosPostFetcher } from "./config/apiConfig";
import { AttesterOppdragRequest } from "./models/AttesterOppdragRequest";
import { OppdaterAttestasjonResponse } from "./models/AttesterOppdragResponse";

export async function hentOppdrag(request: SokeParameter) {
  return await axiosPostFetcher<SokeParameter, Oppdrag[]>(
    BASE_URI.ATTESTASJON,
    "/sok",
    request,
  );
}

export async function oppdaterAttestasjon(request: AttesterOppdragRequest) {
  return await axiosPostFetcher<typeof request, OppdaterAttestasjonResponse>(
    BASE_URI.ATTESTASJON,
    "/attestere",
    request,
  );
}

export function attesterOppdragRequest(
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
