import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  SokeData,
  SokeRequestBody,
  mapToSokeRequestBody,
} from "../../components/form/SokeSchema";
import { AttestasjonTreff } from "../../models/AttestasjonTreff";
import { axiosPostFetcher, swr } from "../config/api";
import { BASE_URI } from "../config/config";

const useFetchTreffliste = (sokedata?: SokeData) => {
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

  const { data, error, mutate, isValidating } = useSWR<AttestasjonTreff[]>(
    shouldFetch ? "/sok" : null,
    swr<AttestasjonTreff[]>((url) =>
      axiosPostFetcher<SokeRequestBody, AttestasjonTreff[]>(
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
export default useFetchTreffliste;
