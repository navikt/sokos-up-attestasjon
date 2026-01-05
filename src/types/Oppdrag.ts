import type { z } from "zod";
import type {
	OppdragDTOListSchema,
	OppdragDTOSchema,
} from "./schema/OppdragSchema";

export type OppdragDTOList = z.infer<typeof OppdragDTOListSchema>;
export type OppdragDTO = z.infer<typeof OppdragDTOSchema>;
