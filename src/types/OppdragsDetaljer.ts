import { z } from "zod";

const OppdragslinjeSchema = z.object({
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

export const OppdragsDetaljerSchema = z.object({
  linjer: z.array(OppdragslinjeSchema),
  saksbehandlerIdent: z.string(),
});

export type OppdragsLinje = z.infer<typeof OppdragslinjeSchema>;
export type OppdragsDetaljer = z.infer<typeof OppdragsDetaljerSchema>;
