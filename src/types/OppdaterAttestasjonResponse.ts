import { z } from "zod";
import OppdaterAttestasjonResponseSchema from "./schema/OppdaterAttestasjonResponseSchema";

export type OppdaterAttestasjonResponse = z.infer<
  typeof OppdaterAttestasjonResponseSchema
>;
