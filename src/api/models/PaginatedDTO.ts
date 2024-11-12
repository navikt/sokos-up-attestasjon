import { z } from "zod";
import { OppdragListSchema } from "../../types/schema/OppdragSchema";

export const PaginatedDTOSchema = z.object({
  data: z.array(z.any()), // Replace `z.any()` with a more specific schema if you know the type of `T`
  page: z.number().int(),
  rows: z.number().int(),
  total: z.number().int(),
});

export const PaginatedOppdragListSchema = PaginatedDTOSchema.extend({
  data: OppdragListSchema,
});

export type PaginatedOppdragList = z.infer<typeof PaginatedOppdragListSchema>;
