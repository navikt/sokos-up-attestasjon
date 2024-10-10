import useSWRImmutable from "swr/immutable";
import { BASE_URI, axiosFetcher, swrConfig } from "../api/config/apiConfig";
import { FagGruppe } from "../types/FagGruppe";

const useFetchFaggrupper = () => {
  const { data, error, isValidating } = useSWRImmutable<FagGruppe[]>(
    `/faggrupper`,
    {
      ...swrConfig<FagGruppe[]>((url) =>
        axiosFetcher<FagGruppe[]>(BASE_URI.OPPDRAGSINFO, url),
      ),
      fallbackData: [],
      revalidateOnMount: true,
    },
  );
  const isLoading = (!error && !data) || isValidating;
  return { data, error, isLoading };
};

export default useFetchFaggrupper;
