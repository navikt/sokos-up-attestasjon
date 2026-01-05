import { z } from "zod";

export const AttestertStatus = {
	IKKE_FERDIG_ATTESTERT_EKSL_EGNE: "IKKE_FERDIG_ATTESTERT_EKSL_EGNE",
	IKKE_FERDIG_ATTESTERT_INKL_EGNE: "IKKE_FERDIG_ATTESTERT_INKL_EGNE",
	ATTESTERT: "ATTESTERT",
	ALLE: "ALLE",
	EGEN_ATTESTERTE: "EGEN_ATTESTERTE",
};
export const AttestertStatusSchema = z.enum([
	"",
	...Object.values(AttestertStatus),
]);
