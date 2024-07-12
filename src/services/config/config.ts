import { CreateAxiosDefaults } from "axios";

export const BASE_URI = {
  ATTESTASJON: "/oppdrag-api/api/v1/attestasjon",
  OPPDRAGSINFO: "/oppdrag-api/api/v1/oppdragsinfo",
};

export const config = (baseUri: string): CreateAxiosDefaults => ({
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
