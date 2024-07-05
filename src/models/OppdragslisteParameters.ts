import { z } from "zod";

export const OppdragslisteParametersSchema = z.object({
  oppdragsIder: z.array(z.number().int()),
});

export type OppdragslisteParameters = z.infer<
  typeof OppdragslisteParametersSchema
>;
