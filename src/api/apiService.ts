import useSWRImmutable from "swr/immutable";
import { AttestasjonlinjeList } from "../types/Attestasjonlinje";
import { FagGruppeList } from "../types/FagGruppe";
import { FagOmraadeList } from "../types/FagOmraade";
import { GjelderNavn } from "../types/GjelderNavn";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";
import { SokeParameter } from "../types/SokeParameter";
import { norskDatoTilIsoDato } from "../util/datoUtil";
import { axiosFetcher, axiosPostFetcher } from "./config/apiConfig";
import { AttesterOppdragRequest } from "./models/AttesterOppdragRequest";
import { AttesterOppdragResponse } from "./models/AttesterOppdragResponse";
import { GjelderIdRequest } from "./models/GjelderIdRequest";
import { PaginatedOppdragList } from "./models/PaginatedDTO";

const BASE_URI = {
  URI: "/oppdrag-api",
  ATTESTASJON_API: "/oppdrag-api/api/v1/attestasjon",
  INTEGRATION_API: "/oppdrag-api/api/v1/integration",
  OPPDRAGSINFO_API: "/oppdrag-api/api/v1/oppdragsinfo",
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
        axiosFetcher<FagGruppeList>(BASE_URI.OPPDRAGSINFO_API, url),
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
        axiosFetcher<FagOmraadeList>(BASE_URI.ATTESTASJON_API, url),
      ),
      fallbackData: [],
      revalidateOnMount: true,
    },
  );
  const isLoading = (!error && !data) || isValidating;

  return { data, error, isLoading };
}

export function useFetchOppdragsdetaljer(oppdragsId?: number) {
  const { data, isLoading, mutate } = useSWRImmutable<OppdragsDetaljer>(
    oppdragsId ? `/${oppdragsId.toString()}/oppdragsdetaljer` : null,
    swrConfig<OppdragsDetaljer>((url) =>
      axiosFetcher<OppdragsDetaljer>(BASE_URI.ATTESTASJON_API, url),
    ),
  );

  return { data, isLoading, mutate };
}

export async function hentOppdrag(
  request: SokeParameter,
  page?: number,
  rows?: number,
) {
  const url =
    page !== undefined && rows !== undefined
      ? `/api/v1/attestasjon/sok?page=${page}&rows=${rows}`
      : `/api/v1/attestasjon/sok`;
  return await axiosPostFetcher<SokeParameter, PaginatedOppdragList>(
    BASE_URI.URI,
    url,
    request,
  );
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
  >(BASE_URI.ATTESTASJON_API, "/attestere", request);
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
