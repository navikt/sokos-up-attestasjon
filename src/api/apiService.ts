import useSWRImmutable from "swr/immutable";
import { AttestasjonlinjeList } from "../types/Attestasjonlinje";
import { FagGruppeList } from "../types/FagGruppe";
import { FagOmraadeDTOList, FagOmraadeList } from "../types/FagOmraade";
import { GjelderNavn } from "../types/GjelderNavn";
import { OppdragDTOList, OppdragList } from "../types/Oppdrag";
import {
  OppdragsDetaljer,
  OppdragsDetaljerDTO,
} from "../types/OppdragsDetaljer";
import { SokeParameter } from "../types/SokeParameter";
import { norskDatoTilIsoDato } from "../util/datoUtil";
import { axiosFetcher, axiosPostFetcher } from "./config/apiConfig";
import { AttesterOppdragRequest } from "./models/AttesterOppdragRequest";
import { AttesterOppdragResponse } from "./models/AttesterOppdragResponse";
import { GjelderIdRequest } from "./models/GjelderIdRequest";

const BASE_URI = {
  ATTESTASJON_API: "/oppdrag-api/api/v1/attestasjon",
  INTEGRATION_API: "/oppdrag-api/api/v1/integration",
  KODEVERK: "/oppdrag-api/api/v1/kodeverk",
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
        axiosFetcher<FagGruppeList>(BASE_URI.KODEVERK, url),
      ),
      fallbackData: [],
      revalidateOnMount: true,
    },
  );
  const isLoading = (!error && !data) || isValidating;
  return { data, error, isLoading };
}

export function useFetchFagomraader() {
  const {
    data: response,
    error,
    isValidating,
  } = useSWRImmutable<FagOmraadeDTOList>(`/fagomraader`, {
    ...swrConfig<FagOmraadeDTOList>((url) =>
      axiosFetcher<FagOmraadeDTOList>(BASE_URI.KODEVERK, url),
    ),
    fallbackData: [],
    revalidateOnMount: true,
  });
  const isLoading = (!error && !response) || isValidating;

  const data: FagOmraadeList = response?.map((dto) => ({
    navn: dto.navnFagomraade,
    kode: dto.kodeFagomraade,
  })) as FagOmraadeList;

  return { data, error, isLoading };
}

export function useFetchOppdragsdetaljer(oppdragsId?: number) {
  const {
    data: response,
    isLoading,
    mutate,
  } = useSWRImmutable<OppdragsDetaljerDTO>(
    oppdragsId ? `/${oppdragsId.toString()}/oppdragsdetaljer` : null,
    swrConfig<OppdragsDetaljerDTO>((url) =>
      axiosFetcher<OppdragsDetaljerDTO>(BASE_URI.ATTESTASJON_API, url),
    ),
  );

  const data: OppdragsDetaljer | null = response
    ? {
        saksbehandlerIdent: response.saksbehandlerIdent,
        linjer: response.oppdragsLinjeList.map((dto) => ({
          oppdragsLinje: {
            attestert: dto.oppdragsLinje.attestert,
            datoVedtakFom: dto.oppdragsLinje.datoVedtakFom,
            datoVedtakTom: dto.oppdragsLinje.datoVedtakTom,
            delytelseId: dto.oppdragsLinje.delytelseId,
            kodeKlasse: dto.oppdragsLinje.kodeKlasse,
            linjeId: dto.oppdragsLinje.linjeId,
            oppdragsId: dto.oppdragsLinje.oppdragsId,
            sats: dto.oppdragsLinje.sats,
            typeSats: dto.oppdragsLinje.typeSats,
            kontonummer: `${dto.oppdragsLinje.hovedkontonr ?? ""}${dto.oppdragsLinje.underkontonr ?? ""}`,
            kid: dto.oppdragsLinje.kid,
            skyldner: dto.oppdragsLinje.skyldnerId,
            refusjonsid: dto.oppdragsLinje.refunderesId,
            utbetalesTil: dto.oppdragsLinje.utbetalesTilId,
            grad: dto.oppdragsLinje.grad,
          },
          ansvarsStedForOppdragsLinje: dto.ansvarsStedForOppdragsLinje,
          kostnadsStedForOppdragsLinje: dto.kostnadsStedForOppdragsLinje,
          attestasjoner: dto.attestasjonList.map((attestasjon) => ({
            attestant: attestasjon.attestantId,
            datoUgyldigFom: attestasjon.datoUgyldigFom,
          })),
        })),
      }
    : null;

  return { data, isLoading, mutate };
}

export async function hentOppdrag(request: SokeParameter) {
  return await axiosPostFetcher<SokeParameter, OppdragDTOList>(
    BASE_URI.ATTESTASJON_API,
    "/sok",
    request,
  ).then((response) => {
    const oppdragList: OppdragList = response.map((dto) => ({
      ansvarsSted: dto.ansvarssted,
      antallAttestanter: dto.antAttestanter,
      fagGruppe: dto.navnFaggruppe,
      fagOmraade: dto.navnFagomraade,
      fagSystemId: dto.fagSystemId,
      gjelderId: dto.oppdragGjelderId,
      kodeFagGruppe: dto.kodeFaggruppe,
      kodeFagOmraade: dto.kodeFagomraade,
      kostnadsSted: dto.kostnadssted,
      oppdragsId: dto.oppdragsId,
      erSkjermetForSaksbehandler: dto.erSkjermetForSaksbehandler,
      hasWriteAccess: dto.hasWriteAccess,
    }));
    return oppdragList;
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
