import axios, { CreateAxiosDefaults } from "axios";
import { ApiError, HttpStatusCodeError } from "../../types/errors";

export const BASE_URI = {
  ATTESTASJON: "/oppdrag-api/api/v1/attestasjon",
  OPPDRAGSINFO: "/oppdrag-api/api/v1/oppdragsinfo",
};

const config = (baseUri: string): CreateAxiosDefaults => ({
  baseURL: baseUri,
  timeout: 30000,
  withCredentials: true,
  headers: {
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
  validateStatus: (status) => status < 400,
});

const api = (baseUri: string) => {
  const instance = axios.create(config(baseUri));

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      switch (error.response?.status) {
        case 400:
          throw new HttpStatusCodeError(error.response?.status);
        case 401 | 403:
          return Promise.reject(error);
        default:
          throw new ApiError("Issues with connection to backend");
      }
    },
  );
  return instance;
};

export const axiosFetcher = <T>(baseUri: string, url: string) =>
  api(baseUri)
    .get<T>(url)
    .then((res) => res.data);

export const axiosPostFetcher = <T, U>(
  baseUri: string,
  url: string,
  body?: T,
) =>
  api(baseUri)
    .post<U>(url, body)
    .then((res) => res.data);

export const swrConfig = <T>(fetcher: (uri: string) => Promise<T>) => ({
  fetcher,
  suspense: true,
  revalidateOnFocus: false,
  refreshInterval: 120000,
});
