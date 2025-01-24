import { z } from "zod";
import {
  FagOmraadeDTOListSchema,
  FagOmraadeListSchema,
  FagOmraadeSchema,
} from "./schema/FagOmraadeSchema";

export type FagOmraadeDTOList = z.infer<typeof FagOmraadeDTOListSchema>;
export type FagOmraadeList = z.infer<typeof FagOmraadeListSchema>;
export type FagOmraade = z.infer<typeof FagOmraadeSchema>;
