import { ZodEffects, ZodString, z } from "zod";
import { FagGruppe, FaggruppeSchema } from "./FagGruppe";
import { FagOmraade, FagOmraadeSchema } from "./FagOmraade";

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
    /^[a-zA-Z0-9-._]*$/,
    "Fagsystem id kan bare inneholde bokstaver, tall, bindestrek, punktum og understrek",
  );

export type SokeData = {
  gjelderId: string;
  fagSystemId: string;
  fagGruppe?: FagGruppe;
  fagOmraade?: FagOmraade;
  attestertStatus: string;
  kombinasjon: never;
};

export const SokeDataSchema = z
  .object({
    gjelderId: z.literal("").or(gjelderIdRule.pipe(gjelderIdLengthRule)),
    fagSystemId: z.optional(fagSystemIdRule),
    fagGruppe: z.optional(FaggruppeSchema),
    fagOmraade: z.optional(FagOmraadeSchema),
    attestertStatus: z.union([
      z.literal("true"),
      z.literal("false"),
      z.literal("undefined"),
    ]),
  })
  .refine(
    (data) => {
      if (data.fagGruppe && data.attestertStatus === "false") return true;
      if (data.fagOmraade && data.attestertStatus === "false") return true;
      if (data.gjelderId?.length !== 0) return true;
      if (data.fagSystemId?.length !== 0 && data.fagOmraade) return true;

      return false;
    },
    {
      message: "Ikke gyldig kombinasjon av søkeparametre",
      path: ["kombinasjon"],
    },
  );

export type ValidFieldNames =
  | "gjelderId"
  | "fagSystemId"
  | "kodeFagGruppe"
  | "kodeFagOmraade"
  | "attestertStatus";
