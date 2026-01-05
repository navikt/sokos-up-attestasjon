import type { z } from "zod";
import type { OppdragslinjeDTOSchema } from "./schema/OppdragslinjeDTOSchema";

export type OppdragsLinjeDTO = z.infer<typeof OppdragslinjeDTOSchema>;
