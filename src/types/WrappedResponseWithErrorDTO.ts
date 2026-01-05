import type { z } from "zod";
import type { WrappedResponseWithErrorDTOSchema } from "./schema/WrappedReponseWithErrorDTOSchema";

export type WrappedResponseWithErrorDTO = z.infer<
	typeof WrappedResponseWithErrorDTOSchema
>;
