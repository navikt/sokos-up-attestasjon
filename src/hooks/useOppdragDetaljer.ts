import useSWR from "swr";
import { BASE_URI, axiosFetcher, swrConfig } from "../api/config/apiConfig";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";

const useOppdragsDetaljer = (oppdragsId: number) => {
  const { data, error, isValidating, mutate } = useSWR<OppdragsDetaljer[]>(
    `/oppdragsdetaljer/${oppdragsId.toString()}`,
    swrConfig<OppdragsDetaljer[]>((url) =>
      axiosFetcher<OppdragsDetaljer[]>(BASE_URI.ATTESTASJON, url),
    ),
  );

  const isLoading = (!error && !data) || isValidating;

  return { data, error, isLoading, mutate };
};

export default useOppdragsDetaljer;
