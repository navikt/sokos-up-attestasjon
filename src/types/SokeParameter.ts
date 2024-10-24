import { z } from "zod";
import { SokeParameterSchema } from "./schema/SokeParameterSchema";

export type SokeParameter = z.infer<typeof SokeParameterSchema>;
