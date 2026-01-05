import type { z } from "zod";
import type { SokeDataSchema } from "./schema/SokeDataSchema";

export type SokeData = z.infer<typeof SokeDataSchema>;
