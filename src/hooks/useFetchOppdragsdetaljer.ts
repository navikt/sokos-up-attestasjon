import useSWRImmutable from "swr/immutable";
import { BASE_URI, axiosFetcher, swrConfig } from "../api/config/apiConfig";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";

export default function useFetchOppdragsdetaljer(oppdragsId?: number) {
  const { data, error, isValidating, mutate } =
    useSWRImmutable<OppdragsDetaljer>(
      oppdragsId ? `/${oppdragsId.toString()}/oppdragsdetaljer` : null,
      swrConfig<OppdragsDetaljer>((url) =>
        axiosFetcher<OppdragsDetaljer>(BASE_URI.ATTESTASJON, url),
      ),
    );
  const isLoading = (!error && !data) || isValidating;

  return { data, error, isLoading, mutate };
}
