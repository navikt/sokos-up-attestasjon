import useSWRImmutable from "swr/immutable";
import { BASE_URI, axiosFetcher, swrConfig } from "../api/config/apiConfig";
import { FagOmraade } from "../types/FagOmraade";

export default function useFetchFagomraader() {
  const { data, error, isValidating } = useSWRImmutable<FagOmraade[]>(
    `/fagomraader`,
    {
      ...swrConfig<FagOmraade[]>((url) =>
        axiosFetcher<FagOmraade[]>(BASE_URI.ATTESTASJON, url),
      ),
      fallbackData: [],
      revalidateOnMount: true,
    },
  );
  const isLoading = (!error && !data) || isValidating;

  return { data, error, isLoading };
}
