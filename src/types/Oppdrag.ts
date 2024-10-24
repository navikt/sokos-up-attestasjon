import { z } from "zod";
import { OppdragListSchema, OppdragSchema } from "./schema/OppdragSchema";

export type OppdragList = z.infer<typeof OppdragListSchema>;
export type Oppdrag = z.infer<typeof OppdragSchema>;
