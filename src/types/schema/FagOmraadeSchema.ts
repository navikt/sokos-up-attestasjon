import { z } from "zod";

export const FagOmraadeSchema = z.object({
  navn: z.string(),
  kode: z.string(),
});

export const FagOmraadeListSchema = z.array(FagOmraadeSchema);
