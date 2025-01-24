import { z } from "zod";
import {
  OppdragsDetaljerDTOSchema,
  OppdragsDetaljerSchema,
} from "./schema/OppdragsDetaljerSchema";

export type OppdragsDetaljerDTO = z.infer<typeof OppdragsDetaljerDTOSchema>;
export type OppdragsDetaljer = z.infer<typeof OppdragsDetaljerSchema>;
