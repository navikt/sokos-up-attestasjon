import { z } from "zod";
import OppdaterAttestasjonResponseSchema from "./schema/AttestereResponseSchema";

export type OppdaterAttestasjonResponse = z.infer<
  typeof OppdaterAttestasjonResponseSchema
>;
