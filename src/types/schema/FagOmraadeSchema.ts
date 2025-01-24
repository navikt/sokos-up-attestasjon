import { z } from "zod";

export const FagOmraadeDTOSchema = z.object({
  navnFagomraade: z.string(),
  kodeFagomraade: z.string(),
});

export const FagOmraadeSchema = z.object({
  navn: z.string(),
  kode: z.string(),
});

export const FagOmraadeDTOListSchema = z.array(FagOmraadeDTOSchema);
export const FagOmraadeListSchema = z.array(FagOmraadeSchema);
