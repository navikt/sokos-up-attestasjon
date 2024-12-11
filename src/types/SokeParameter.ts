import { z } from "zod";
import { SokeDataSchema } from "./schema/SokeDataSchema";
import { SokeParameterSchema } from "./schema/SokeParameterSchema";

export type SokeParameter = z.infer<typeof SokeParameterSchema>;

export const SokeDataToSokeParameter = SokeDataSchema.transform((sokeData) => {
  return {
    gjelderId: sokeData.gjelderId,
    fagSystemId: sokeData.fagSystemId,
    kodeFagGruppe: sokeData.fagGruppe?.type,
    kodeFagOmraade: sokeData.fagOmraade?.kode,
    attestert:
      sokeData.alternativer === "3"
        ? true
        : sokeData.alternativer === "1" || sokeData.alternativer === "2"
          ? false
          : null,
    visEgenAttestertOppdrag:
      sokeData.alternativer === "2" || sokeData.alternativer === "5",
  };
});
