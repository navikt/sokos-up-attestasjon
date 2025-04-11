import { z } from "zod";

export const OppdragslinjeDTOSchema = z.object({
  oppdragsLinje: z.object({
    attestert: z.boolean(),
    datoVedtakFom: z.string(),
    datoVedtakTom: z.string().optional(),
    delytelseId: z.string(),
    kodeKlasse: z.string(),
    linjeId: z.number().int(),
    oppdragsId: z.number().int(),
    sats: z.number(),
    typeSats: z.string(),
    hovedkontonr: z.string().optional(),
    underkontonr: z.string().optional(),
    grad: z.number().optional(),
    kid: z.string().optional(),
    refunderesId: z.string().optional(),
    skyldnerId: z.string().optional(),
    utbetalesTilId: z.string().optional(),
  }),
  ansvarsStedForOppdragsLinje: z.string().optional(),
  kostnadsStedForOppdragsLinje: z.string().optional(),
  attestasjonList: z.array(
    z.object({
      attestantId: z.string().optional(),
      datoUgyldigFom: z.string().optional(),
    }),
  ),
});
