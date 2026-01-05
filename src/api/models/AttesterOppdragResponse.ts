import { z } from "zod";

export const AttesterOppdragResponseSchema = z.object({
	successMessage: z.string().optional(),
	errorMessage: z.string().optional(),
});

export type AttesterOppdragResponse = z.infer<
	typeof AttesterOppdragResponseSchema
>;
