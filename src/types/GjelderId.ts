import { z } from "zod";
import { GjelderIdSchema } from "./schema/GjelderIdSchema";

export type GjelderId = z.infer<typeof GjelderIdSchema>;
