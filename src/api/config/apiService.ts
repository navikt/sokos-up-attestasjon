import { SokeData, SokeParameter } from "../../components/form/SokeSchema";
import { Oppdrag } from "../../types/Oppdrag";
import { BASE_URI, axiosPostFetcher } from "./apiConfig";

export async function hentOppdrag(request: SokeData) {
  const sokeParameter: SokeParameter = {
    gjelderId: request?.gjelderId,
    fagSystemId: request?.fagSystemId,
    kodeFagGruppe: request?.kodeFagGruppe[0],
    kodeFagOmraade: request?.kodeFagOmraade[0],
    attestert: request?.attestertStatus,
  };

  return await axiosPostFetcher<SokeParameter, Oppdrag[]>(
    BASE_URI.ATTESTASJON,
    "/sok",
    sokeParameter,
  );
}
