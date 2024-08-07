import useSWR from "swr";
import { BASE_URI, axiosFetcher, swrConfig } from "../api/config/apiConfig";
import { FagOmraade } from "../types/FagOmraade";

const useFetchFagomraader = () => {
  const { data, error, isValidating } = useSWR<FagOmraade[]>(
    `/fagomraader`,
    swrConfig<FagOmraade[]>((url) =>
      axiosFetcher<FagOmraade[]>(BASE_URI.ATTESTASJON, url),
    ),
  );
  const isLoading = (!error && !data) || isValidating;

  return { data, error, isLoading };
};
export default useFetchFagomraader;
