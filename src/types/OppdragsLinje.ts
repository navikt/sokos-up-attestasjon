import { z } from "zod";
import { OppdragslinjeSchema } from "./schema/OppdragslinjeSchema";

export type OppdragsLinje = z.infer<typeof OppdragslinjeSchema>;
