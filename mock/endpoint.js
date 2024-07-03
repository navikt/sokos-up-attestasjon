import gjeldersok from "./POST_GjelderSok.json";
import oppdragslinjeSok from "./POST_oppdragslinjeSok.json";

export default [
  {
    url: "/oppdrag-api/api/v1/attestasjon/sok",
    method: "POST",
    response: () => gjeldersok,
  },
  {
  url: "/oppdrag-api/api/v1/attestasjon/oppdragslinjer/:oppdragsId",
  method: "GET",
  response: () => oppdragslinjeSok,
  },
  ];
