import { useEffect, useState } from "react";
import useSWR from "swr";
import { BASE_URI, axiosPostFetcher, swrConfig } from "../api/config/apiConfig";
import {
  SokeData,
  SokeRequestBody,
  mapToSokeRequestBody,
} from "../components/form/SokeSchema";
import { Oppdrag } from "../types/Oppdrag";

const useSokOppdrag = (sokedata?: SokeData) => {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  useEffect(() => {
    if (
      !!sokedata &&
      (sokedata?.gjelderId ||
        sokedata?.fagsystemId ||
        sokedata?.kodeFaggruppe ||
        sokedata?.kodeFagomraade)
    )
      setShouldFetch(true);
  }, [sokedata]);

  const sokeRequestBody = mapToSokeRequestBody(sokedata);

  const { data, error, mutate, isValidating } = useSWR<Oppdrag[]>(
    shouldFetch ? "/sok" : null,
    swrConfig<Oppdrag[]>((url) =>
      axiosPostFetcher<SokeRequestBody, Oppdrag[]>(
        BASE_URI.ATTESTASJON,
        url,
        sokeRequestBody,
      ),
    ),
  );

  const isLoading = (!error && !data) || isValidating;

  return {
    treffliste: data,
    trefflisteError: error,
    mutate,
    isLoading,
  };
};

export default useSokOppdrag;
