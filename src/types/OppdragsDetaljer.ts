import { z } from "zod";

export const OppdragsDetaljerSchema = z.object({
  ansvarsStedForOppdrag: z.string().optional(),
  ansvarsStedForOppdragsLinje: z.string().optional(),
  antallAttestanter: z.number(),
  attestant: z.string().optional(),
  datoUgyldigFom: z.string().optional(),
  datoVedtakFom: z.string(),
  datoVedtakTom: z.string().optional(),
  delytelsesId: z.string(),
  fagSystemId: z.string(),
  kodeKlasse: z.string(),
  kostnadsStedForOppdrag: z.string(),
  kostnadsStedForOppdragsLinje: z.string().optional(),
  linjeId: z.string(),
  navnFagGruppe: z.string(),
  navnFagOmraade: z.string(),
  oppdragGjelderId: z.string(),
  oppdragsId: z.string(),
  sats: z.number(),
  satstype: z.string(),
});

export type OppdragsDetaljer = z.infer<typeof OppdragsDetaljerSchema>;
