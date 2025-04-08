/* eslint-disable no-console */
import { HttpResponse, http } from "msw";
import fagGrupper from "./json/faggrupper.json";
import fagOmraader from "./json/fagomraader.json";
import oppdragsDetaljer from "./json/oppdragsDetaljer.json";
import sokOppdrag from "./json/sokOppdrag.json";

export const handlers = [
  http.post("/oppdrag-api/api/v1/attestasjon/sok", async ({ request }) => {
    const sokeParameter = (await request.json()) as { gjelderId?: string };
    console.log("Sok parameter:", sokeParameter);

    if (sokeParameter?.gjelderId === "11111111111") {
      return HttpResponse.json(
        {
          data: [],
          errorMessage: "Mangler rettigheter til å se informasjon!",
        },
        { status: 200 },
      );
    }

    if (sokeParameter?.gjelderId === "22222222222") {
      return HttpResponse.json(
        {
          data: [],
          errorMessage: "",
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        data: sokOppdrag,
        errorMessage: "", // Include empty error message for success case
      },
      { status: 200 },
    );
  }),

  http.post("/oppdrag-api/api/v1/integration/hentnavn", async ({ request }) => {
    const sokeParameter = await request.json();
    console.log("Hent navn parameter:", sokeParameter);
    return HttpResponse.json({ navn: "Test Testesen" }, { status: 200 });
  }),

  http.post(
    "/oppdrag-api/api/v1/attestasjon/attestere",
    async ({ request }) => {
      const sokeParameter = await request.json();
      console.log("Attester parameter:", sokeParameter);
      return HttpResponse.json(
        {
          /* errorMessage: "Oppdatering feilet!" */ successMessage:
            "Oppdatering vellykket!",
        },
        { status: 200 },
      );
    },
  ),

  http.get(
    "/oppdrag-api/api/v1/attestasjon/:oppdragsId/oppdragsdetaljer",
    () => {
      return HttpResponse.json(oppdragsDetaljer, { status: 200 });
    },
  ),

  http.get("/oppdrag-api/api/v1/kodeverk/faggrupper", () => {
    return HttpResponse.json(fagGrupper, { status: 200 });
  }),

  http.get("/oppdrag-api/api/v1/kodeverk/fagomraader", () => {
    return HttpResponse.json(fagOmraader, { status: 200 });
  }),
];
