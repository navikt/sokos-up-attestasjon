import { z } from "zod";

export const OppdragslinjeSchema = z.object({
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
    kontonummer: z.string(),
    kid: z.string().optional(),
    skyldner: z.string().optional(),
    refusjonsid: z.string().optional(),
    utbetalesTil: z.string().optional(),
    grad: z.number().optional(),
  }),
  ansvarsStedForOppdragsLinje: z.string().optional(),
  kostnadsStedForOppdragsLinje: z.string().optional(),
  attestasjoner: z.array(
    z.object({
      attestant: z.string().optional(),
      datoUgyldigFom: z.string().optional(),
    }),
  ),
});
