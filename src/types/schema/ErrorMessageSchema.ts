import { z } from "zod";

export const ErrorMessageSchema = z.object({
	variant: z.enum(["error", "warning", "announcement", "success"]),
	message: z.string(),
});
