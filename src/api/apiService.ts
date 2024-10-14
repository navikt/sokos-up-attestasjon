import { Attestasjonlinje } from "../types/Attestasjonlinje";
import { GjelderNavn } from "../types/GjelderNavn";
import { Oppdrag } from "../types/Oppdrag";
import { SokeParameter } from "../types/SokeParameter";
import { norskDatoTilIsoDato } from "../util/datoUtil";
import { BASE_URI, axiosPostFetcher } from "./config/apiConfig";
import { AttesterOppdragRequest } from "./models/AttesterOppdragRequest";
import { OppdaterAttestasjonResponse } from "./models/AttesterOppdragResponse";
import { GjelderIdRequest } from "./models/GjelderIdRequest";

export async function hentOppdrag(request: SokeParameter) {
  return await axiosPostFetcher<SokeParameter, Oppdrag[]>(
    BASE_URI.ATTESTASJON,
    "/sok",
    request,
  );
}

export async function hentNavn(request: GjelderIdRequest) {
  return await axiosPostFetcher<GjelderIdRequest, GjelderNavn>(
    BASE_URI.INTEGRATION,
    "/hentnavn",
    request,
  );
}

export async function oppdaterAttestasjon(request: AttesterOppdragRequest) {
  return await axiosPostFetcher<
    AttesterOppdragRequest,
    OppdaterAttestasjonResponse
  >(BASE_URI.ATTESTASJON, "/attestere", request);
}

export function attesterOppdragRequest(
  fagSystemId: string,
  kodeFagOmraade: string,
  gjelderId: string,
  oppdragsId: number,
  changes: Attestasjonlinje[],
): AttesterOppdragRequest {
  return {
    oppdragsId,
    fagSystemId,
    kodeFagOmraade,
    gjelderId,
    linjer:
      changes
        .filter(
          (attestasjonlinje) =>
            attestasjonlinje.properties.attester ||
            attestasjonlinje.properties.fjern,
        )
        .map((attestasjonlinje) => {
          const datoUgyldigFom = attestasjonlinje.properties.attester
            ? undefined
            : attestasjonlinje.properties.activelyChangedDatoUgyldigFom
              ? norskDatoTilIsoDato(
                  attestasjonlinje.properties.activelyChangedDatoUgyldigFom,
                )
              : attestasjonlinje.properties.suggestedDatoUgyldigFom
                ? norskDatoTilIsoDato(
                    attestasjonlinje.properties.suggestedDatoUgyldigFom,
                  )
                : attestasjonlinje.datoUgyldigFom
                  ? norskDatoTilIsoDato(attestasjonlinje.datoUgyldigFom)
                  : "";

          return {
            linjeId: Number(attestasjonlinje.linjeId),
            attestantIdent: attestasjonlinje.attestant,
            datoUgyldigFom,
          };
        }) ?? [],
  };
}
