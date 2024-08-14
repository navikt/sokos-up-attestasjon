import { z } from "zod";

export const OppdragsDetaljerSchema = z.object({
  ansvarsSted: z.string(),
  antallAttestanter: z.number(),
  attestant: z.string().optional(),
  datoUgyldigFom: z.string().optional(),
  datoVedtakFom: z.string(),
  datoVedtakTom: z.string(),
  delytelsesId: z.string(),
  navnFagGruppe: z.string(),
  navnFagOmraade: z.string(),
  fagSystemId: z.string(),
  klasse: z.string(),
  kostnadsSted: z.string(),
  linjeId: z.string(),
  oppdragGjelderId: z.string(),
  sats: z.number(),
  satstype: z.string(),
});

export type OppdragsDetaljer = z.infer<typeof OppdragsDetaljerSchema>;
