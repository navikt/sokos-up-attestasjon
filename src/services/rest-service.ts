import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Oppdragsegenskaper } from "../models/Oppdragsegenskaper";
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

// Brukes av omposteringer, oppdrag og treffliste for å kunne sende med fnr i requestbody
const axiosPostFetcher = <T>(url: string, body: { gjelderId?: string }) =>
  api.post<T>(url, body).then((res) => res.data);

const useFetchOppdrag = () => {
  const { data, isLoading } = useSWR<Oppdragsegenskaper[]>(
    "/personsok",
    swrConfig,
  );
  return { data, isLoading };
};

const useFetchTreffliste = (gjelderId?: string) => {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  useEffect(() => {
    setShouldFetch(!!gjelderId && [9, 11].includes(gjelderId.length));
  }, [gjelderId]);
  const { data, error, mutate, isValidating } = useSWR<Oppdragsegenskaper[]>(
    shouldFetch ? "/personsok" : null,
    {
      ...swrConfig,
      fetcher: (url) =>
        axiosPostFetcher<Oppdragsegenskaper[]>(url, {
          gjelderId,
        }),
    },
  );

  const isLoading = (!error && !data) || isValidating;

  return {
    treffliste: data,
    trefflisteError: error,
    mutate,
    trefflisteIsLoading: isLoading,
  };
};

const RestService = {
  useFetchOppdrag,
  useFetchTreffliste,
};

export default RestService;
