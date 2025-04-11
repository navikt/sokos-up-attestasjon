import { z } from "zod";

export const OppdragDTOSchema = z.object({
  ansvarssted: z.string().optional(),
  antAttestanter: z.number().int(),
  navnFaggruppe: z.string(),
  navnFagomraade: z.string(),
  fagSystemId: z.string(),
  oppdragGjelderId: z.string(),
  kodeFaggruppe: z.string(),
  kodeFagomraade: z.string(),
  kostnadssted: z.string(),
  oppdragsId: z.number().int(),
  erSkjermetForSaksbehandler: z.boolean(),
  hasWriteAccess: z.boolean(),
});

export const OppdragDTOListSchema = z.array(OppdragDTOSchema);
