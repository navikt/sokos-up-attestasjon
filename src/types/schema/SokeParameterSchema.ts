import { z } from "zod";
import { AttestertStatusSchema } from "./AttestertStatus";

export const SokeParameterSchema = z.object({
  gjelderId: z.string().optional(),
  fagSystemId: z.string().optional(),
  kodeFagGruppe: z.string().optional(),
  kodeFagOmraade: z.string().optional(),
  attestertStatus: AttestertStatusSchema,
});
