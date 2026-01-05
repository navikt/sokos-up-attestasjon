import { HttpResponse, http } from "msw";
import { fagGrupperList } from "./data/faggrupper";
import { fagomraadeList } from "./data/fagomraader";
import { oppdragsDetaljerDto } from "./data/oppdragsDetaljer";
import { oppdragsDetaljerDtoEmpty } from "./data/oppdragsDetaljerEmpty";
import { oppdragDtoList } from "./data/sokOppdrag";

export const handlers = [
	http.post("/oppdrag-api/api/v1/attestasjon/sok", async ({ request }) => {
		const sokeParameter = (await request.json()) as { gjelderId?: string };
		// biome-ignore lint/suspicious/noConsole: debug code
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
				data: oppdragDtoList,
				errorMessage: "",
			},
			{ status: 200 },
		);
	}),

	http.post("/oppdrag-api/api/v1/integration/hentnavn", async ({ request }) => {
		const sokeParameter = await request.json();
		// biome-ignore lint/suspicious/noConsole: debug code
		console.log("Hent navn parameter:", sokeParameter);
		return HttpResponse.json({ navn: "Test Testesen" }, { status: 200 });
	}),

	http.post(
		"/oppdrag-api/api/v1/attestasjon/attestere",
		async ({ request }) => {
			const sokeParameter = await request.json();
			// biome-ignore lint/suspicious/noConsole: debug code
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
