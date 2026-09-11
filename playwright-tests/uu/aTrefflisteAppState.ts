import type { AppState } from "../../src/store/AppState";
import { AttestertStatus } from "../../src/types/schema/AttestertStatus";

const state: { state: AppState; version: number } = {
	state: {
		gjelderNavn: "Navn Fra Treffliste AppState",
		oppdragDtoList: [
			{
				ansvarssted: "1337",
				antAttestanter: 1,
				navnFaggruppe: "HELSETJENESTER FRIKORT TAK 1 OG 2",
				navnFagomraade: "Egenandelsrefusjon frikort tak 1",
				fagSystemId: "12344321",
				oppdragGjelderId: "12345612345",
				kodeFaggruppe: "FRIKORT",
				kodeFagomraade: "FRIKORT1",
				kostnadssted: "2360",
				oppdragsId: 25798519,
				erSkjermetForSaksbehandler: false,
				hasWriteAccess: true,
			},
		],

		sokeData: {
			gjelderId: "12345612345",
			alternativer: AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE,
			fagSystemId: "",
		},
	},
	version: 0,
};
export default state;
