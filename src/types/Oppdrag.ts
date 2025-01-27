import { z } from "zod";
import {
  OppdragDTOListSchema,
  OppdragListSchema,
  OppdragSchema,
} from "./schema/OppdragSchema";

export type OppdragDTOList = z.infer<typeof OppdragDTOListSchema>;
export type OppdragList = z.infer<typeof OppdragListSchema>;
export type Oppdrag = z.infer<typeof OppdragSchema>;
