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
  fagGruppe: z.string(),
  fagOmraade: z.string(),
  fagSystemId: z.string(),
  gjelderId: z.string(),
  kodeKlasse: z.string(),
  kodeFagOmraade: z.string(),
  kostnadsStedForOppdrag: z.string(),
  kostnadsStedForOppdragsLinje: z.string().optional(),
  linjeId: z.number(),
  oppdragsId: z.number(),
  sats: z.number(),
  satstype: z.string(),
});

export type OppdragsDetaljer = z.infer<typeof OppdragsDetaljerSchema>;
