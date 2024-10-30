import { z } from "zod";
import ZosResponseSchema from "./schema/ZosResponseSchema";

export type ZosResponse = z.infer<typeof ZosResponseSchema>;
