import type { z } from "zod";
import type { GjelderIdSchema } from "./schema/GjelderIdSchema";

export type GjelderId = z.infer<typeof GjelderIdSchema>;
