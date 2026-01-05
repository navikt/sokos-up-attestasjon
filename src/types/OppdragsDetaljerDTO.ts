import type { z } from "zod";
import type { OppdragsDetaljerDTOSchema } from "./schema/OppdragsDetaljerDTOSchema";

export type OppdragsDetaljerDTO = z.infer<typeof OppdragsDetaljerDTOSchema>;
