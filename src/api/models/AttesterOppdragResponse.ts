import { z } from "zod";

export const OppdaterResponseSchema = z.object({
  OSAttestasjonOperationResponse: z.object({
    Attestasjonskvittering: z.object({
      ResponsAttestasjon: z.object({
        OppdragGjelderId: z.string().optional(),
        OppdragsId: z.number().optional(),
        AntLinjerMottatt: z.number().optional(),
        Statuskode: z.number().optional(),
        Melding: z.string().optional(),
      }),
    }),
  }),
});

export type AttesterOppdragResponse = z.infer<typeof OppdaterResponseSchema>;
