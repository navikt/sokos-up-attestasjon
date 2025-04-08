import { z } from "zod";
import { WrappedResponseWithErrorDTOSchema } from "./schema/WrappedReponseWithErrorDTOSchema";

export type WrappedResponseWithErrorDTO = z.infer<
  typeof WrappedResponseWithErrorDTOSchema
>;
