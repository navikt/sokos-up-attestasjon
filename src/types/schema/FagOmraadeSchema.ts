import { z } from "zod";

export const FagOmraadeSchema = z.object({
	navnFagomraade: z.string(),
	kodeFagomraade: z.string(),
});

export const FagOmraadeListSchema = z.array(FagOmraadeSchema);
