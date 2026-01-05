import type { AppState } from "../../../src/store/AppState";
import type { SokeData } from "../../../src/types/SokeData";
import { AttestertStatus } from "../../../src/types/schema/AttestertStatus";

export function aStateWith(sokeData: Partial<SokeData>): {
	state: AppState;
	version: number;
} {
	return {
		state: {
			gjelderNavn: "",
			sokeData: {
				gjelderId: "",
				alternativer: AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE,
				...sokeData,
			},
		},
		version: 0,
	};
}
