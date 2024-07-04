import { z } from "zod";

export const OppdragslisteParametersSchema = z.object({
  oppdragsIDer: z.array(z.number().int()),
});

export type OppdragslisteParameters = z.infer<
  typeof OppdragslisteParametersSchema
>;
