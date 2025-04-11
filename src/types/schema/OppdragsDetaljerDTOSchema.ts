import { z } from "zod";
import { OppdragslinjeDTOSchema } from "./OppdragslinjeDTOSchema";

export const OppdragsDetaljerDTOSchema = z.object({
  oppdragsLinjeList: z.array(OppdragslinjeDTOSchema),
  saksbehandlerIdent: z.string(),
});
