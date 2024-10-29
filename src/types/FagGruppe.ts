import { z } from "zod";
import { FagGruppeListSchema, FaggruppeSchema } from "./schema/FagGruppeSchema";

export type FagGruppeList = z.infer<typeof FagGruppeListSchema>;
export type FagGruppe = z.infer<typeof FaggruppeSchema>;
