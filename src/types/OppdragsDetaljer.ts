import { z } from "zod";
import { OppdragsDetaljerSchema } from "./schema/OppdragsDetaljerSchema";

export type OppdragsDetaljer = z.infer<typeof OppdragsDetaljerSchema>;
