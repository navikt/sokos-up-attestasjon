import { z } from "zod";

export const OppdragSchema = z.object({
  gjelderId: z.string(),
  fagGruppe: z.string(),
  fagOmraade: z.string(),
  oppdragsId: z.number().int(),
  fagSystemId: z.string(),
  kostnadsSted: z.string(),
  ansvarsSted: z.string(),
});

export type Oppdrag = z.infer<typeof OppdragSchema>;
