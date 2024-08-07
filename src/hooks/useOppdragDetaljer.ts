import useSWR from "swr";
import { BASE_URI, axiosPostFetcher, swrConfig } from "../api/config/apiConfig";
import { OppdragsIdRequest } from "../api/models/OppdragsIdRequest";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";

const useOppdragsDetaljer = (oppdragsIder: OppdragsIdRequest) => {
  const { data, error, isValidating } = useSWR<OppdragsDetaljer[]>(
    "/oppdragsdetaljer",
    swrConfig<OppdragsDetaljer[]>((url) =>
      axiosPostFetcher<OppdragsIdRequest, OppdragsDetaljer[]>(
        BASE_URI.ATTESTASJON,
        url,
        oppdragsIder,
      ),
    ),
  );

  const isLoading = (!error && !data) || isValidating;

  return { data, error, isLoading };
};

export default useOppdragsDetaljer;
