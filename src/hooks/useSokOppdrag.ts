import useSWRImmutable from "swr/immutable";
import { BASE_URI, axiosPostFetcher, swrConfig } from "../api/config/apiConfig";
import {
  SokeData,
  SokeRequestBody,
  mapToSokeRequestBody,
} from "../components/form/SokeSchema";
import { Oppdrag } from "../types/Oppdrag";

const useSokOppdrag = (sokedata?: SokeData) => {
  const sokeRequestBody = mapToSokeRequestBody(sokedata);

  const { data, error, isLoading } = useSWRImmutable<Oppdrag[]>(
    "/sok",
    swrConfig<Oppdrag[]>((url) =>
      axiosPostFetcher<SokeRequestBody, Oppdrag[]>(
        BASE_URI.ATTESTASJON,
        url,
        sokeRequestBody,
      ),
    ),
  );

  return {
    data,
    error,
    isLoading,
  };
};

export default useSokOppdrag;
