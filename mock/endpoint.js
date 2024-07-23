import gjeldersok from "./POST_GjelderSok.json";
import oppdragslinjer from "./GET_oppdragslinjer.json";
import oppdrag from "./POST_oppdragslinjer.json";
import faggrupper from "./GET_faggrupper.json";
import fagomraader from "./GET_fagomraader.json";

export default [
  {
    url: "/oppdrag-api/api/v1/attestasjon/sok",
    method: "POST",
    response: (request) => {
      if(request.body.gjelderId === "11111111111") {
        return [];
      }
      return gjeldersok;
    } 
  },
  {
    url: "/oppdrag-api/api/v1/attestasjon/oppdragslinjer/:oppdragsId",
    method: "GET",
    response: () => oppdragslinjer
  },
  {
    url: "/oppdrag-api/api/v1/attestasjon/oppdragslinjer",
    method: "POST",
    response: () => oppdrag
  },
  {
    method: "GET",
    /*.....*/ url: "/oppdrag-api/api/v1/oppdragsinfo/faggrupper",
    /*............*/ response: () => faggrupper
  },
  {
    method: "GET",
    /*.....*/ url: "/oppdrag-api/api/v1/attestasjon/fagomraader",
    /*............*/ response: () => fagomraader
  }
];
