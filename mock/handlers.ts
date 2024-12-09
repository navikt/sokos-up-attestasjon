/* eslint-disable no-console */
import { http, HttpResponse } from "msw";
import fagGrupper from "./json/faggrupper.json";
import fagOmraader from "./json/fagomraader.json";
import oppdaterAttestasjon from "./json/oppdaterAttestasjon.json";
import oppdragsDetaljer from "./json/oppdragsDetaljer.json";
import sokOppdrag from "./json/sokOppdrag.json";

export const handlers = [
  http.post("/oppdrag-api/api/v1/attestasjon/sok", async ({ request }) => {
    const sokeParameter = await request.json();
    console.log("Sok parameter:", sokeParameter);

    return HttpResponse.json(sokOppdrag, { status: 200 });
  }),

  http.post("/oppdrag-api/api/v1/integration/hentnavn", async ({ request }) => {
    const sokeParameter = await request.json();
    console.log("Hent navn parameter:", sokeParameter);
    return HttpResponse.json({ navn: "Test Testesen" }, { status: 200 });
  }),

  http.post("/oppdrag-api/api/v1/attestasjon/attestere", async ({ request }) => {
    const sokeParameter = await request.json();
    console.log("Attester parameter:", sokeParameter);
    return HttpResponse.json(oppdaterAttestasjon, { status: 200 });
  }),

  http.get("/oppdrag-api/api/v1/attestasjon/:oppdragsId/oppdragsdetaljer", () => {
    return HttpResponse.json(oppdragsDetaljer, { status: 200 });
  }),

  http.get("/oppdrag-api/api/v1/oppdragsinfo/faggrupper", () => {
    return HttpResponse.json(fagGrupper, { status: 200 });
  }),

  http.get("/oppdrag-api/api/v1/attestasjon/fagomraader", () => {
    return HttpResponse.json(fagOmraader, { status: 200 });
  })
];
