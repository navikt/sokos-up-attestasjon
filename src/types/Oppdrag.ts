import { z } from "zod";

export const OppdragSchema = z.object({
  ansvarsSted: z.string(),
  antallAttestanter: z.number().int(),
  fagGruppe: z.string(),
  fagOmraade: z.string(),
  fagSystemId: z.string(),
  gjelderId: z.string(),
  kodeFagGruppe: z.string(),
  kodeFagOmraade: z.string(),
  kostnadsSted: z.string(),
  oppdragsId: z.number().int(),
});

export type Oppdrag = z.infer<typeof OppdragSchema>;
