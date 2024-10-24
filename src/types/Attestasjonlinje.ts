import { z } from "zod";
import {
  AttestasjonlinjeListSchema,
  AttestasjonlinjeSchema,
} from "./schema/AttestasjonlinjeSchema";

export type AttestasjonlinjeList = z.infer<typeof AttestasjonlinjeListSchema>;
export type Attestasjonlinje = z.infer<typeof AttestasjonlinjeSchema>;
