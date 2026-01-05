import type { z } from "zod";
import type {
	FagOmraadeListSchema,
	FagOmraadeSchema,
} from "./schema/FagOmraadeSchema";

export type FagOmraadeList = z.infer<typeof FagOmraadeListSchema>;
export type FagOmraade = z.infer<typeof FagOmraadeSchema>;
