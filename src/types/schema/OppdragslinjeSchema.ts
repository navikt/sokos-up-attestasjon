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
    kid: z.string(),
    skyldner: z.string(),
    refusjonsid: z.string(),
    utbetalesTil: z.string(),
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
