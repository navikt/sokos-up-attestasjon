import { z } from "zod";

const linjerSchema = z.object({
  linjeId: z.number().min(0).max(99999),
  attestantId: z.string().max(8),
  datoUgyldigFom: z.string().max(10),
});

export const OppdaterSchema = z.object({
  gjelderId: z.string().max(11),
  fagOmraade: z.string().max(8),
  oppdragsId: z.number().min(0).max(999_999_999),
  brukerId: z.string().max(8),
  kjorIdag: z.boolean(),
  linjer: z.array(linjerSchema).max(2000).min(0),
});

export type OppdaterAttestasjon = z.infer<typeof OppdaterSchema>;
