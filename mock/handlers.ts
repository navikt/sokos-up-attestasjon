/** biome-ignore-all lint/suspicious/noConsole: false positive */
import { HttpResponse, http } from "msw";
import { fagGrupperList } from "./data/faggrupper";
import { fagomraadeList } from "./data/fagomraader";
import { oppdragsDetaljerDto } from "./data/oppdragsDetaljer";
import { oppdragsDetaljerDtoEmpty } from "./data/oppdragsDetaljerEmpty";
import { oppdragDtoList } from "./data/sokOppdrag";

// Teller antall /sok-kall per gjelderId, slik at man kan simulere at et
// påfølgende kall (f.eks. automatisk henting ved mount/refresh, eller
// "Last inn på nytt") feiler etter at det første søket har gått bra.
const sokCallCountPerGjelderId = new Map<string, number>();

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

		// Bruk gjelderId 33333333333 for å teste feilmeldingen (Alert) i
		// søkekriterie-boksen på trefflisten: første søk går bra, men alle
		// påfølgende /sok-kall (autom. reload ved mount/refresh, eller
		// "Last inn på nytt"-knappen) feiler med en simulert serverfeil.
		if (sokeParameter?.gjelderId === "33333333333") {
			const callCount =
				(sokCallCountPerGjelderId.get(sokeParameter.gjelderId) ?? 0) + 1;
			sokCallCountPerGjelderId.set(sokeParameter.gjelderId, callCount);

			if (callCount > 1) {
				return HttpResponse.json(
					{
						data: [],
						errorMessage:
							"Simulert feil: klarte ikke å hente trefflisten fra sokos-oppdrag.",
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
		}

		if (sokeParameter?.gjelderId === "99999999999") {
			return HttpResponse.json(
				{
					data: [
						oppdragDtoList.find((oppdrag) => oppdrag.oppdragsId === 999999999),
					].filter(Boolean),
					errorMessage: "",
				},
				{ status: 200 },
			);
		}

		return HttpResponse.json(
			{
				data: [],
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
			const sokeParameter = await request.json();
			console.log("Attester parameter:", sokeParameter);
			return HttpResponse.json(
				{
					successMessage: "Oppdatering vellykket!",
				},
				{ status: 200 },
			);
		},
	),

	http.get(
		"/oppdrag-api/api/v1/attestasjon/:oppdragsId/oppdragsdetaljer",
		({ params }) => {
			const oppdragsId = params.oppdragsId as string;

			if (oppdragsId === "999999999") {
				return HttpResponse.json(oppdragsDetaljerDtoEmpty, { status: 200 });
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
