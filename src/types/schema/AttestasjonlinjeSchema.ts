import { z } from "zod";

export const AttestasjonlinjeSchema = z.object({
  kodeKlasse: z.string(),
  delytelseId: z.string(),
  sats: z.number(),
  typeSats: z.string(),
  datoVedtakFom: z.string(),
  datoVedtakTom: z.string().optional(),
  oppdragsId: z.number(),
  linjeId: z.number(),
  attestant: z.string().optional(),
  datoUgyldigFom: z.string().optional(),
  properties: z.object({
    activelyChangedDatoUgyldigFom: z.string().optional(),
    attester: z.boolean(),
    fjern: z.boolean(),
    suggestedDatoUgyldigFom: z.string().optional(),
    dateError: z.string().optional(),
    vises: z.boolean(),
  }),
});

export const AttestasjonlinjeListSchema = z.array(AttestasjonlinjeSchema);
