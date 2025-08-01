import { z } from "zod";
import { AttestertStatus, AttestertStatusSchema } from "./AttestertStatus";
import { FaggruppeSchema } from "./FagGruppeSchema";
import { FagOmraadeSchema } from "./FagOmraadeSchema";

export const SokeDataSchema = z
  .object({
    gjelderId: z.string(),
    fagSystemId: z.string().optional(),
    fagGruppe: FaggruppeSchema.optional(),
    fagOmraade: FagOmraadeSchema.optional(),
    alternativer: AttestertStatusSchema,
  })
  .refine(
    (data) => {
      if (data.gjelderId && data.gjelderId.length > 0) {
        if (!/^[0-9\s.]*$/.test(data.gjelderId)) {
          return false; // bare tall
        }
        const cleanedId = data.gjelderId.replace(/[\s.]/g, "");
        if (![9, 11].includes(cleanedId.length)) {
          return false; // fnr eller orgnr
        }
      }

      if (data.fagSystemId && data.fagSystemId.length > 0) {
        if (!/^[a-zæøåA-ZÆØÅ0-9-._]*$/.test(data.fagSystemId)) {
          return false;
        }
      }

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
