import useSWR from "swr";
import { Attestasjonsdetaljer } from "../../models/Attestasjonsdetaljer";
import { axiosPostFetcher, swr } from "../config/api";
import { BASE_URI } from "../config/config";

const useFetchFlereOppdrag = (oppdragsIder: number[]) => {
  const { data, error, isValidating } = useSWR<Attestasjonsdetaljer[]>(
    "/oppdragslinjer",
    swr<Attestasjonsdetaljer[]>((url) =>
      axiosPostFetcher<number[], Attestasjonsdetaljer[]>(
        BASE_URI.ATTESTASJON,
        url,
        oppdragsIder,
      ),
    ),
  );

  const isLoading = (!error && !data) || isValidating;

  return { data, error, isLoading };
};

export default useFetchFlereOppdrag;
