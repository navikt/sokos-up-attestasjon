import { ZodEffects, ZodString, z } from "zod";
import { FaggruppeSchema } from "./FagGruppeSchema";
import { FagOmraadeSchema } from "./FagOmraadeSchema";

const gjelderIdRule: ZodString = z
  .string()
  .regex(/^[0-9]*$/, "Gjelder-feltet kan bare inneholde tall");

const gjelderIdLengthRule: ZodEffects<ZodString, string, string> = z
  .string()
  .refine(
    (s) => [9, 11].includes(s.length),
    "Gjelder-feltet må inneholde et orgnummer (9 siffer) eller fødselsnummer (11 siffer)",
  );

const fagSystemIdRule: ZodString = z
  .string()
  .regex(
    /^[a-zæøåA-ZÆØÅ0-9-._]*$/,
    "Fagsystem id kan bare inneholde bokstaver, tall, bindestrek, punktum og understrek",
  );

export const SokeDataSchema = z
  .object({
    gjelderId: z.literal("").or(gjelderIdRule.pipe(gjelderIdLengthRule)),
    fagSystemId: z.optional(fagSystemIdRule),
    fagGruppe: z.optional(FaggruppeSchema),
    fagOmraade: z.optional(FagOmraadeSchema),
    alternativer: z.enum([
      "IKKE_FERDIG_ATTESTERT_EKSL_EGNE",
      "IKKE_FERDIG_ATTESTERT_INKL_EGNE",
      "ATTESTERT",
      "ALLE",
      "EGEN_ATTESTERTE",
    ]),
  })
  .refine(
    (data) => {
      if (
        data.fagGruppe &&
        [
          "IKKE_FERDIG_ATTESTERT_EKSL_EGNE",
          "IKKE_FERDIG_ATTESTERT_INKL_EGNE",
        ].includes(data.alternativer)
      )
        return true;
      if (
        data.fagOmraade &&
        [
          "IKKE_FERDIG_ATTESTERT_EKSL_EGNE",
          "IKKE_FERDIG_ATTESTERT_INKL_EGNE",
        ].includes(data.alternativer)
      )
        return true;
      if (data.gjelderId?.length !== 0) return true;
      return !!((data.fagSystemId?.length ?? 0) >= 4 && data.fagOmraade);
    },
    {
      message: "Ikke gyldig kombinasjon av søkeparametre",
      path: ["kombinasjon"],
    },
  );
