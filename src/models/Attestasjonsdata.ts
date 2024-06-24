import { z } from "zod";

export const AttestasjonsdataSchema = z.object({
  kodeFaggruppe: z.string(),
  navnFaggruppe: z.string(),
  kodeFagomraade: z.string(),
  navnFagomraade: z.string(),
  oppdragsId: z.number().int(),
  fagsystemId: z.string(),
  oppdragGjelderId: z.string(),
  antAttestanter: z.number().int(),
  linjeId: z.number().int(),
  attestert: z.string(),
  datoVedtakFom: z.string(),
  datoVedtakTom: z.string().optional(),
  kodeStatus: z.string(),
});

export type Attestasjonsdata = z.infer<typeof AttestasjonsdataSchema>;
