import { z } from "zod";

const OppdaterAttestasjonResponseSchema = z.object({
  message: z.string().optional(),
});

export default OppdaterAttestasjonResponseSchema;
