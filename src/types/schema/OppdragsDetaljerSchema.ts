import { z } from "zod";
import {
  OppdragslinjeDTOSchema,
  OppdragslinjeSchema,
} from "./OppdragslinjeSchema";

export const OppdragsDetaljerDTOSchema = z.object({
  oppdragsLinjeList: z.array(OppdragslinjeDTOSchema),
  saksbehandlerIdent: z.string(),
});

export const OppdragsDetaljerSchema = z.object({
  linjer: z.array(OppdragslinjeSchema),
  saksbehandlerIdent: z.string(),
});
