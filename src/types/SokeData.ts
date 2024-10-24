import { z } from "zod";
import { SokeDataSchema } from "./schema/SokeDataSchema";

export type SokeData = z.infer<typeof SokeDataSchema>;
