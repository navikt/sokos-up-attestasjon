import { z } from "zod";

export const GjelderNavnSchema = z.object({
  navn: z.string(),
});

export type GjelderNavn = z.infer<typeof GjelderNavnSchema>;
