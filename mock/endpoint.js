import faggrupper from "./GET_faggrupper.json";
import fagomraader from "./GET_fagomraader.json";
import oppdragDetaljer from "./POST_oppdragsDetaljer.json";
import sok from "./POST_sok.json";

export default [
  {
    url: "/oppdrag-api/api/v1/attestasjon/sok",
    method: "POST",
    response: (request) => {
      if(request.body.gjelderId === "11111111111") {
        return [];
      }
      return sok;
    }
  },
  {
    url: "/oppdrag-api/api/v1/attestasjon/oppdragsdetaljer",
    method: "POST",
    response: () => oppdragDetaljer
  },
  {
    method: "GET",
    url: "/oppdrag-api/api/v1/oppdragsinfo/faggrupper",
    response: () => faggrupper
  },
  {
    method: "GET",
    url: "/oppdrag-api/api/v1/attestasjon/fagomraader",
    response: () => fagomraader
  }
];
