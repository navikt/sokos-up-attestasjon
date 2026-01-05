import type { OppdragsDetaljerDTO } from "../../src/types/OppdragsDetaljerDTO";

const oppdragsdetaljerEtterAttestering: OppdragsDetaljerDTO = {
	oppdragsLinjeList: [
		{
			oppdragsLinje: {
				attestert: false,
				datoVedtakFom: "2024-05-01",
				datoVedtakTom: "2024-05-31",
				delytelseId: "1",
				kodeKlasse: "SPREFAGFER-IOP",
				linjeId: 1,
				oppdragsId: 98765432,
				sats: 1234.0,
				typeSats: "ENG",
				hovedkontonr: "123",
				underkontonr: "4567",
				skyldnerId: "Ola Nordmann",
				refunderesId: "1234567",
				utbetalesTilId: "Ola Nordmann",
				grad: 100,
			},
			attestasjonList: [
				{
					attestantId: "G133837",
					datoUgyldigFom: "9999-12-31",
				},
				{
					attestantId: "H135685",
					datoUgyldigFom: "9999-12-31",
				},
			],
		},
	],
	saksbehandlerIdent: "H135685",
};

export default oppdragsdetaljerEtterAttestering;
