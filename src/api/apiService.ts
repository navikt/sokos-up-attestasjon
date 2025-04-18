import useSWRImmutable from "swr/immutable";
import { AttestasjonlinjeList } from "../types/Attestasjonlinje";
import { FagGruppeList } from "../types/FagGruppe";
import { FagOmraadeList } from "../types/FagOmraade";
import { GjelderNavn } from "../types/GjelderNavn";
import { OppdragsDetaljerDTO } from "../types/OppdragsDetaljerDTO";
import { SokeParameter } from "../types/SokeParameter";
import { WrappedResponseWithErrorDTO } from "../types/WrappedResponseWithErrorDTO";
import { norskDatoTilIsoDato } from "../util/datoUtil";
import { axiosFetcher, axiosPostFetcher } from "./apiConfig";
import { AttesterOppdragRequest } from "./models/AttesterOppdragRequest";
import { AttesterOppdragResponse } from "./models/AttesterOppdragResponse";
import { GjelderIdRequest } from "./models/GjelderIdRequest";

const BASE_URI = {
  ATTESTASJON_API: "/oppdrag-api/api/v1/attestasjon",
  INTEGRATION_API: "/oppdrag-api/api/v1/integration",
  KODEVERK_API: "/oppdrag-api/api/v1/kodeverk",
};

function swrConfig<T>(fetcher: (uri: string) => Promise<T>) {
  return {
    fetcher,
    suspense: true,
    revalidateOnFocus: false,
    refreshInterval: 600000,
  };
}

export function useFetchFaggrupper() {
  const { data, error, isValidating } = useSWRImmutable<FagGruppeList>(
    `/faggrupper`,
    {
      ...swrConfig<FagGruppeList>((url) =>
        axiosFetcher<FagGruppeList>(BASE_URI.KODEVERK_API, url),
      ),
      fallbackData: [],
      revalidateOnMount: true,
    },
  );
  const isLoading = (!error && !data) || isValidating;
  return { data, error, isLoading };
}

export function useFetchFagomraader() {
  const { data, error, isValidating } = useSWRImmutable<FagOmraadeList>(
    `/fagomraader`,
    {
      ...swrConfig<FagOmraadeList>((url) =>
        axiosFetcher<FagOmraadeList>(BASE_URI.KODEVERK_API, url),
      ),
      fallbackData: [],
      revalidateOnMount: true,
    },
  );
  const isLoading = (!error && !data) || isValidating;

  return { data, error, isLoading };
}

export function useFetchOppdragsdetaljer(oppdragsId?: number) {
  const { data, isLoading, mutate } = useSWRImmutable<OppdragsDetaljerDTO>(
    oppdragsId ? `/${oppdragsId.toString()}/oppdragsdetaljer` : null,
    swrConfig<OppdragsDetaljerDTO>((url) =>
      axiosFetcher<OppdragsDetaljerDTO>(BASE_URI.ATTESTASJON_API, url),
    ),
  );

  return { data, isLoading, mutate };
}

export async function hentOppdrag(request: SokeParameter) {
  return await axiosPostFetcher<SokeParameter, WrappedResponseWithErrorDTO>(
    BASE_URI.ATTESTASJON_API,
    "/sok",
    request,
  ).then((response) => {
    if (response.errorMessage) {
      throw new Error(response.errorMessage);
    }

    return response.data;
  });
}

export async function hentNavn(request: GjelderIdRequest) {
  return await axiosPostFetcher<GjelderIdRequest, GjelderNavn>(
    BASE_URI.INTEGRATION_API,
    "/hentnavn",
    request,
  );
}

export async function oppdaterAttestasjon(request: AttesterOppdragRequest) {
  return await axiosPostFetcher<
    AttesterOppdragRequest,
    AttesterOppdragResponse
  >(BASE_URI.ATTESTASJON_API, "/attestere", request).then((response) => {
    if (response.errorMessage) {
      throw new Error(response.errorMessage);
    }
    return response;
  });
}

export function attesterOppdragRequest(
  fagSystemId: string,
  kodeFagOmraade: string,
  gjelderId: string,
  oppdragsId: number,
  changes: AttestasjonlinjeList,
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
