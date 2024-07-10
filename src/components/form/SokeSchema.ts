import { ZodEffects, ZodString, z } from "zod";

export type SokeData = {
  gjelderId: string;
  fagsystemId: string | undefined;
  kodeFaggruppe: string | undefined;
  kodeFagomraade: string | undefined;
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
  fagsystemId: string | undefined;
  kodeFaggruppe: string | undefined;
  kodeFagomraade: string | undefined;
  attestert: boolean | undefined;
};

export const mapToSokeRequestBody = (sokedata?: SokeData) => ({
  gjelderId: sokedata?.gjelderId,
  fagsystemId: sokedata?.fagsystemId,
  kodeFaggruppe: sokedata?.kodeFaggruppe,
  kodeFagomraade: sokedata?.kodeFagomraade,
  attestert: parseAttestert(sokedata?.attestertStatus),
});

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
    attestertStatus: z.union([
      z.literal("true"),
      z.literal("false"),
      z.literal("null"),
    ]),
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

export type ValidFieldNames =
  | "gjelderId"
  | "fagsystemId"
  | "kodeFaggruppe"
  | "kodeFagomraade"
  | "attestertStatus";
