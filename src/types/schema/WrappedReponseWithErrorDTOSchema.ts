import { z } from "zod";
import { OppdragDTOListSchema } from "./OppdragSchema";

export const WrappedResponseWithErrorDTOSchema = z.object({
  data: OppdragDTOListSchema,
  errorMessage: z.string(),
});
