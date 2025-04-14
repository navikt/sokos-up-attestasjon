import { z } from "zod";
import { OppdragsDetaljerDTOSchema } from "./schema/OppdragsDetaljerDTOSchema";

export type OppdragsDetaljerDTO = z.infer<typeof OppdragsDetaljerDTOSchema>;
