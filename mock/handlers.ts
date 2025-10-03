/* eslint-disable no-console */
import { HttpResponse, http } from "msw";
import { fagGrupperList } from "./data/faggrupper";
import { fagomraadeList } from "./data/fagomraader";
import { oppdragsDetaljerDto } from "./data/oppdragsDetaljer";
import {
  oppdragsDetaljerAllAttested,
  oppdragsDetaljerSingleLine,
} from "./data/oppdragsDetaljerSingleLine";
import { oppdragDtoList } from "./data/sokOppdrag";

let singleLineAttested = false;

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

    // Test case: Single oppdrag with single line (for testing redirect after attestation)
    if (sokeParameter?.gjelderId === "33333333333") {
      if (singleLineAttested) {
        console.log("Test: Returning empty result after attestation");
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
          data: [
            {
              ansvarssted: "2340",
              antAttestanter: 1,
              navnFaggruppe: "Test Faggruppe",
              navnFagomraade: "Test Fagområde",
              fagSystemId: "TEST001",
              oppdragGjelderId: "33333333333",
              kodeFaggruppe: "TEST",
              kodeFagomraade: "TEST1",
              kostnadssted: "2360",
              oppdragsId: 99999001,
              erSkjermetForSaksbehandler: false,
              hasWriteAccess: true,
            },
          ],
          errorMessage: "",
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      {
        data: oppdragDtoList,
        errorMessage: "",
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
      const attestRequest = (await request.json()) as { oppdragsId?: number };
      console.log("Attester parameter:", attestRequest);

      if (attestRequest.oppdragsId === 99999001) {
        singleLineAttested = true;
        console.log("Test: Single line marked as attested");
      }

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
    ({ params }) => {
      const { oppdragsId } = params;

      if (oppdragsId === "99999001") {
        if (singleLineAttested) {
          console.log("Test: Returning attested single line data");
          return HttpResponse.json(oppdragsDetaljerAllAttested, {
            status: 200,
          });
        }
        return HttpResponse.json(oppdragsDetaljerSingleLine, { status: 200 });
      }

      if (oppdragsId === "99999002") {
        return HttpResponse.json(oppdragsDetaljerAllAttested, { status: 200 });
      }

      return HttpResponse.json(oppdragsDetaljerDto, { status: 200 });
    },
  ),

  http.get("/oppdrag-api/api/v1/kodeverk/faggrupper", () => {
    return HttpResponse.json(fagGrupperList, { status: 200 });
  }),

  http.get("/oppdrag-api/api/v1/kodeverk/fagomraader", () => {
    return HttpResponse.json(fagomraadeList, { status: 200 });
  }),
];
