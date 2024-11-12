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
      sokeData.attestertStatus === "true"
        ? true
        : sokeData.attestertStatus === "false"
          ? false
          : null,
  };
});
