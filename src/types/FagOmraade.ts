import { z } from "zod";

export const FagOmraadeSchema = z.object({
  navn: z.string(),
  kode: z.string(),
});

export type FagOmraade = z.infer<typeof FagOmraadeSchema>;
