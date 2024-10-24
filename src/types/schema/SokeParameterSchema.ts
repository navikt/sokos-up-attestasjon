import { z } from "zod";

export const SokeParameterSchema = z.object({
  gjelderId: z.string().optional(),
  fagSystemId: z.string().optional(),
  kodeFagGruppe: z.string().optional(),
  kodeFagOmraade: z.string().optional(),
  attestert: z.union([z.boolean(), z.null()]).default(null),
});
