import { z } from "zod";

const ikkeblank = z.string().min(1, "Søkefeltet kan ikke være blankt");

const baretallregel = z
  .string()
  .regex(/^[0-9\s.]*$/, "Dette søkefeltet kan bare inneholde tall");

const lengderegel = z
  .string()
  .refine(
    (s) => [9, 11].includes(s.replace(/[\s.]/g, "").length),
    "Må enten gjelde en organisasjon(orgnummer 9 siffer) eller en person (fødselsnummer 11 siffer)",
  );

export const GjelderIdSchema = ikkeblank.pipe(baretallregel).pipe(lengderegel);
