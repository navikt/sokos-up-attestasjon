import { z } from "zod";
import { OppdragslinjeDTOSchema } from "./schema/OppdragslinjeDTOSchema";

export type OppdragsLinjeDTO = z.infer<typeof OppdragslinjeDTOSchema>;
