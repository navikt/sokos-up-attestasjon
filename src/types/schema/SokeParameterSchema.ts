import { z } from "zod";

export type AttestertStatus =
  | "IKKE_FERDIG_ATTESTERT_EKSL_EGNE"
  | "IKKE_FERDIG_ATTESTERT_INKL_EGNE"
  | "ATTESTERT"
  | "ALLE"
  | "EGEN_ATTESTERTE";

export const SokeParameterSchema = z.object({
  gjelderId: z.string().optional(),
  fagSystemId: z.string().optional(),
  kodeFagGruppe: z.string().optional(),
  kodeFagOmraade: z.string().optional(),
  attestertStatus: z.enum([
    "IKKE_FERDIG_ATTESTERT_EKSL_EGNE",
    "IKKE_FERDIG_ATTESTERT_INKL_EGNE",
    "ATTESTERT",
    "ALLE",
    "EGEN_ATTESTERTE",
  ]),
});
