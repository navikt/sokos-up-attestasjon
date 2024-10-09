import { z } from "zod";

export const OppdaterAttestasjonResponseSchema = z.object({
  message: z.string().optional(),
});

export type OppdaterAttestasjonResponse = z.infer<
  typeof OppdaterAttestasjonResponseSchema
>;
