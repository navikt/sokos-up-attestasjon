import { z } from "zod";

const linjerSchema = z.object({
  linjeId: z.number().min(0).max(99999),
  attestantId: z.string().max(8),
  datoUgyldigFom: z.string().max(10),
});

export const OppdaterSchema = z.object({
  oppdragsId: z.number().min(0).max(999_999_999),
  linjer: z.array(linjerSchema).max(2000).min(0),
});

export type AttesterOppdragRequest = z.infer<typeof OppdaterSchema>;
