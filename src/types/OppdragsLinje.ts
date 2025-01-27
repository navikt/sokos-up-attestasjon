import { z } from "zod";
import {
  OppdragslinjeDTOSchema,
  OppdragslinjeSchema,
} from "./schema/OppdragslinjeSchema";

export type OppdragsLinje = z.infer<typeof OppdragslinjeSchema>;
export type OppdragsLinjeDTO = z.infer<typeof OppdragslinjeDTOSchema>;
