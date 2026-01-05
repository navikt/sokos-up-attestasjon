import type { z } from "zod";
import type {
	FagGruppeListSchema,
	FaggruppeSchema,
} from "./schema/FagGruppeSchema";

export type FagGruppeList = z.infer<typeof FagGruppeListSchema>;
export type FagGruppe = z.infer<typeof FaggruppeSchema>;
