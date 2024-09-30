import { useCallback, useEffect, useState } from "react";
import { BASE_URI, axiosFetcher } from "../api/config/apiConfig";
import { OppdragsDetaljer } from "../types/OppdragsDetaljer";

const useOppdragsDetaljer = (oppdragsId: number) => {
  const [data, setData] = useState<Array<OppdragsDetaljer>>();
  const [error, setError] = useState();

  const mutate = useCallback(() => {
    // La stå! Dette virker unødvendig, men det trigges ikke rerender av alt som
    // kommer fra arrayen om man ikke setter data til undefined først
    setData(() => undefined);
    axiosFetcher<OppdragsDetaljer[]>(
      BASE_URI.ATTESTASJON,
      `/oppdragsdetaljer/${oppdragsId.toString()}`,
    )
      .then((resp) => setData(() => resp))
      .catch((e) => setError(e));
  }, [oppdragsId]);

  useEffect(() => {
    mutate();
  }, [mutate]);

  const isLoading = !error && !data;

  return { data, error, isLoading, mutate };
};

export default useOppdragsDetaljer;
