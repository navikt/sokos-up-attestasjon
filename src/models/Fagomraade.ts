import { z } from "zod";

export const FagomraadeSchema = z.object({
  navn: z.string(),
  kode: z.string(),
});

export type Fagomraade = z.infer<typeof FagomraadeSchema>;
