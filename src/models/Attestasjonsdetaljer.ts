import { z } from "zod";

export const AttestasjonsdetaljerSchema = z.object({
  klasse: z.string(),
  delytelsesId: z.string(),
  sats: z.number(),
  satstype: z.string(),
  datoVedtakFom: z.string(),
  datoVedtakTom: z.string(),
  attestant: z.string().optional(),
  navnFagomraade: z.string(),
  fagsystemId: z.string(),
});

export type Attestasjonsdetaljer = z.infer<typeof AttestasjonsdetaljerSchema>;
