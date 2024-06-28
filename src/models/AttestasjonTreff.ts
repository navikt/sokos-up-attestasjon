import { z } from "zod";

export const AttestasjonTreffSchema = z.object({
  navnFaggruppe: z.string(),
  navnFagomraade: z.string(),
  oppdragsId: z.number().int(),
  fagsystemId: z.string(),
});

export type AttestasjonTreff = z.infer<typeof AttestasjonTreffSchema>;
