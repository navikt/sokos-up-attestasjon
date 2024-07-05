import { FieldError, UseFormRegister } from "react-hook-form";
import { ZodEffects, ZodString, z } from "zod";

export type SokeData = {
  gjelderId: string;
  fagsystemId: string | undefined;
  kodeFaggruppe: string | undefined;
  kodeFagomraade: string | undefined;
  attestertStatus: string | undefined;
  kombinasjon: never;
};

const baretallregel: ZodString = z
  .string()
  .regex(/^[0-9\s.]*$/, "Gjelder-Id-feltet kan bare inneholde tall");

const lengderegel: ZodEffects<ZodString, string, string> = z
  .string()
  .refine(
    (s) => [9, 11].includes(s.replace(/[\s.]/g, "").length),
    "Gjelder-Id-feltet må inneholde et orgnummer (9 siffer) eller fødselsnummer (11 siffer)",
  );

export const SokeSchema = z
  .object({
    gjelderId: z.literal("").or(baretallregel.pipe(lengderegel)),
    fagsystemId: z.optional(z.string()),
    kodeFaggruppe: z.optional(z.string()),
    kodeFagomraade: z.optional(z.string()),
    attestertStatus: z
      .literal("")
      .or(
        z
          .string()
          .regex(/^(true|false)$/, 'Må være enten "true" eller "false"'),
      ),
  })
  .refine(
    (data) => {
      if (data.kodeFaggruppe?.length !== 0 && data.attestertStatus === "false")
        return true;
      if (data.kodeFagomraade?.length !== 0 && data.attestertStatus === "false")
        return true;
      if (data.gjelderId?.length !== 0) return true;
      if (data.fagsystemId?.length !== 0 && data.kodeFagomraade?.length !== 0)
        return true;

      return false;
    },
    {
      message: "Ikke gyldig kombinasjon av søkeparametre",
      path: ["kombinasjon"],
    },
  );

export type FormFieldProps = {
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<SokeData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type ValidFieldNames =
  | "gjelderId"
  | "fagsystemId"
  | "kodeFaggruppe"
  | "kodeFagomraade"
  | "attestertStatus";
