import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { SokeData } from "../components/form/SokeSchema";
import { AttestasjonTreff } from "../models/AttestasjonTreff";
import { Attestasjonsdetaljer } from "../models/Attestasjonsdetaljer";
import { ApiError, HttpStatusCodeError } from "../types/errors";

const BASE_API_URL = "/oppdrag-api/api/v1/attestasjon";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
  validateStatus: (status) => status < 400,
});

const axiosFetcher = (url: string) => api.get(url).then((res) => res.data);

const swrConfig = {
  fetcher: axiosFetcher,
  suspense: true,
  revalidateOnFocus: false,
  refreshInterval: 120000,
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 400) {
      // her kan vi legge feilkoder også som vi fra backend
      throw new HttpStatusCodeError(error.response?.status);
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Uinnlogget - vil ikke skje i miljø da appen er beskyttet
      return Promise.reject(error);
    }
    throw new ApiError("Issues with connection to backend");
  },
);

type SokeRequestBody = {
  gjelderId: string | undefined;
  fagsystemId: string | undefined;
  kodeFaggruppe: string | undefined;
  kodeFagomraade: string | undefined;
  attestert: boolean | undefined;
};

// Brukes av omposteringer, oppdrag og treffliste for å kunne sende med fnr i requestbody
const axiosPostFetcher = <T>(url: string, body?: SokeRequestBody) =>
  api.post<T>(url, body).then((res) => res.data);

const axiosPostFetcherWithParams = <T>(url: string, oppdragsIder: number[]) =>
  api.post<T>(url, oppdragsIder).then((res) => res.data);

const useFetchEnkeltOppdrag = (oppdragsID: string) => {
  const { data, isLoading } = useSWR<Attestasjonsdetaljer[]>(
    `/oppdragslinjer/${oppdragsID}`,
    swrConfig,
  );
  return { data, isLoading };
};

const parseAttestert = (attestertStatus: string | undefined) => {
  if (!attestertStatus) return undefined;
  if (attestertStatus === "null") return undefined;
  return attestertStatus === "true";
};

const useFetchTreffliste = (sokedata?: SokeData) => {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  useEffect(() => {
    if (
      !!sokedata &&
      (sokedata?.gjelderId ||
        sokedata?.fagsystemId ||
        sokedata?.kodeFaggruppe ||
        sokedata?.kodeFagomraade)
    )
      setShouldFetch(true);
  }, [sokedata]);

  const sokeRequestBody = {
    gjelderId: sokedata?.gjelderId,
    fagsystemId: sokedata?.fagsystemId,
    kodeFaggruppe: sokedata?.kodeFaggruppe,
    kodeFagomraade: sokedata?.kodeFagomraade,
    attestert: parseAttestert(sokedata?.attestertStatus),
  };

  const { data, error, mutate, isValidating } = useSWR<AttestasjonTreff[]>(
    shouldFetch ? "/sok" : null,
    {
      ...swrConfig,
      fetcher: (url) =>
        axiosPostFetcher<AttestasjonTreff[]>(url, sokeRequestBody),
    },
  );

  const isLoading = (!error && !data) || isValidating;

  return {
    treffliste: data,
    trefflisteError: error,
    mutate,
    isLoading,
  };
};

const useFetchFlereOppdrag = (oppdragsIder: number[]) => {
  const { data, error, isValidating } = useSWR<Attestasjonsdetaljer>(
    "/oppdragslinjer",
    {
      ...swrConfig,
      fetcher: (url) =>
        axiosPostFetcherWithParams<Attestasjonsdetaljer>(url, oppdragsIder),
    },
  );

  const isLoading = (!error && !data) || isValidating;

  return {
    data,
    error,
    isLoading,
  };
};

const RestService = {
  useFetchEnkeltOppdrag,
  useFetchTreffliste,
  useFetchFlereOppdrag,
};

export default RestService;
