import { z } from "zod";

export const AttesterOppdragResponseSchema = z.object({
  message: z.string().optional(),
});

export type AttesterOppdragResponse = z.infer<
  typeof AttesterOppdragResponseSchema
>;
