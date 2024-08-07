import { z } from "zod";

export const OppdragsIdRequestSchema = z.object({
  oppdragsIder: z.array(z.number().int()),
});

export type OppdragsIdRequest = z.infer<typeof OppdragsIdRequestSchema>;
