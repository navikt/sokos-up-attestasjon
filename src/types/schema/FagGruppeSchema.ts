import { z } from "zod";

export const FaggruppeSchema = z.object({
  navn: z.string(),
  type: z.string(),
});

export const FagGruppeListSchema = z.array(FaggruppeSchema);
