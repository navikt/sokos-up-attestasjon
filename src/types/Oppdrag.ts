import { z } from "zod";

export const OppdragSchema = z.object({
  gjelderId: z.string(),
  navnFagGruppe: z.string(),
  navnFagOmraade: z.string(),
  oppdragsId: z.number().int(),
  fagsystemId: z.string(),
});

export type Oppdrag = z.infer<typeof OppdragSchema>;
