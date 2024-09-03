import { z } from "zod";

const linjerSchema = z.object({
  linjeId: z.number().min(0).max(99999),
  datoUgyldigFom: z.string().max(10).optional(),
});

export const OppdaterSchema = z.object({
  gjelderId: z.string(),
  fagSystemId: z.string(),
  kodeFagOmraade: z.string(),
  oppdragsId: z.number().min(0).max(999_999_999),
  linjer: z.array(linjerSchema).max(2000).min(0),
});

export type AttesterOppdragRequest = z.infer<typeof OppdaterSchema>;
