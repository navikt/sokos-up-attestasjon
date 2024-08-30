import { z } from "zod";

export const OppdaterResponsSchema = z.object({
  OppdragGjelderId: z.string().max(11),
  OppdragsId: z.number().min(0).max(9999999999),
  AntLinjerMottatt: z.number().min(0).max(99999),
  Statuskode: z.number().min(0).max(99),
  Melding: z.string().max(100),
});

export type AttesterOppdragResponse = z.infer<typeof OppdaterResponsSchema>;
