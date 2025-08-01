import { z } from "zod";
import { AttestertStatus, AttestertStatusSchema } from "./AttestertStatus";
import { FaggruppeSchema } from "./FagGruppeSchema";
import { FagOmraadeSchema } from "./FagOmraadeSchema";

export const SokeDataSchema = z
  .object({
    gjelderId: z
      .string()
      .refine(
        (val) => !val || val.length === 0 || /^[0-9]*$/.test(val),
        "Gjelder-feltet kan bare inneholde tall",
      )
      .refine((val) => {
        if (!val || val.length === 0) return true;
        return [9, 11].includes(val.length);
      }, "Gjelder-feltet må inneholde et orgnummer (9 siffer) eller fødselsnummer (11 siffer)"),
    fagSystemId: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val || val.length === 0 || /^[a-zæøåA-ZÆØÅ0-9-._]*$/.test(val),
        "Fagsystem id kan bare inneholde bokstaver, tall, bindestrek, punktum og understrek",
      ),
    fagGruppe: FaggruppeSchema.optional(),
    fagOmraade: FagOmraadeSchema.optional(),
    alternativer: AttestertStatusSchema,
  })
  .refine(
    (data) => {
      if (
        data.fagGruppe &&
        [
          AttestertStatus.IKKE_FERDIG_ATTESTERT_EKSL_EGNE,
          AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE,
        ].includes(data.alternativer)
      )
        return true;
      if (
        data.fagOmraade &&
        [
          AttestertStatus.IKKE_FERDIG_ATTESTERT_EKSL_EGNE,
          AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE,
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
