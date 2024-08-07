import { z } from "zod";

export const FaggruppeSchema = z.object({
  navn: z.string(),
  type: z.string(),
});

export type FagGruppe = z.infer<typeof FaggruppeSchema>;
