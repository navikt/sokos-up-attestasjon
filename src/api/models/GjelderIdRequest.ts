import { z } from "zod";

export const GjelderIdRequestSchema = z.object({
	gjelderId: z.string().optional(),
});

export type GjelderIdRequest = z.infer<typeof GjelderIdRequestSchema>;
