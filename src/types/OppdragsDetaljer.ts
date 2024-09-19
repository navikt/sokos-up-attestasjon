import { z } from "zod";

const OppdragslinjeSchema = z.object({
  oppdragsLinje: z.object({
    attestert: z.boolean(),
    datoVedtakFom: z.string(),
    datoVedtakTom: z.string().optional(),
    delytelseId: z.string(),
    kodeKlasse: z.string(),
    linjeId: z.number(),
    oppdragsId: z.number(),
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
  antallAttestanter: z.number(),
  fagGruppe: z.string(),
  fagOmraade: z.string(),
  fagSystemId: z.string(),
  gjelderId: z.string(),
  kodeFagOmraade: z.string(),
  kostnadsStedForOppdrag: z.string(),
  oppdragsId: z.number(),
  ansvarsStedForOppdrag: z.string().optional(),
  linjer: z.array(OppdragslinjeSchema),
});

export type OppdragsLinje = z.infer<typeof OppdragslinjeSchema>;
export type OppdragsDetaljer = z.infer<typeof OppdragsDetaljerSchema>;
