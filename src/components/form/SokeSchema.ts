import { ZodEffects, ZodString, z } from "zod";

export type SokeData = {
  gjelderId: string;
  fagSystemId: string | undefined;
  kodeFagGruppe: string | undefined;
  kodeFagOmraade: string | undefined;
  attestertStatus: string;
  kombinasjon: never;
};

const parseAttestert = (attestertStatus: string | undefined) => {
  if (!attestertStatus) return undefined;
  if (attestertStatus === "null") return undefined;
  return attestertStatus === "true";
};

export type SokeRequestBody = {
  gjelderId: string | undefined;
  fagSystemId: string | undefined;
  kodeFagGruppe: string | undefined;
  kodeFagOmraade: string | undefined;
  attestert: boolean | undefined;
};

export const mapToSokeRequestBody = (sokedata?: SokeData) => ({
  gjelderId: sokedata?.gjelderId,
  fagSystemId: sokedata?.fagSystemId,
  kodeFagGruppe: sokedata?.kodeFagGruppe,
  kodeFagOmraade: sokedata?.kodeFagOmraade,
  attestert: parseAttestert(sokedata?.attestertStatus),
});

const baretallregel: ZodString = z
  .string()
  .regex(/^[0-9]*$/, "Gjelder-Id-feltet kan bare inneholde tall");

const lengderegel: ZodEffects<ZodString, string, string> = z
  .string()
  .refine(
    (s) => [9, 11].includes(s.length),
    "Gjelder-Id-feltet må inneholde et orgnummer (9 siffer) eller fødselsnummer (11 siffer)",
  );

export const SokeSchema = z
  .object({
    gjelderId: z.literal("").or(baretallregel.pipe(lengderegel)),
    fagSystemId: z.optional(z.string()),
    kodeFagGruppe: z.optional(z.string()),
    kodeFagOmraade: z.optional(z.string()),
    attestertStatus: z.union([
      z.literal("true"),
      z.literal("false"),
      z.literal("null"),
    ]),
  })
  .refine(
    (data) => {
      if (data.kodeFagGruppe?.length !== 0 && data.attestertStatus === "false")
        return true;
      if (data.kodeFagOmraade?.length !== 0 && data.attestertStatus === "false")
        return true;
      if (data.gjelderId?.length !== 0) return true;
      if (data.fagSystemId?.length !== 0 && data.kodeFagOmraade?.length !== 0)
        return true;

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
