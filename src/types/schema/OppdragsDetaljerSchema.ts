import { z } from "zod";
import { OppdragslinjeSchema } from "./OppdragslinjeSchema";

export const OppdragsDetaljerSchema = z.object({
  linjer: z.array(OppdragslinjeSchema),
  saksbehandlerIdent: z.string(),
});
