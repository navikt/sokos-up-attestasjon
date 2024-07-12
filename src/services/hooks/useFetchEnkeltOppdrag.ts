import useSWR from "swr";
import { Attestasjonsdetaljer } from "../../models/Attestasjonsdetaljer";
import { axiosFetcher, swr } from "../config/api";
import { BASE_URI } from "../config/config";

const useFetchEnkeltOppdrag = (oppdragsID: string) => {
  const { data, error, isValidating } = useSWR<Attestasjonsdetaljer[]>(
    `/oppdragslinjer/${oppdragsID}`,
    swr<Attestasjonsdetaljer[]>((url) =>
      axiosFetcher<Attestasjonsdetaljer[]>(BASE_URI.ATTESTASJON, url),
    ),
  );
  const isLoading = (!error && !data) || isValidating;

  return { data, error, isLoading };
};
export default useFetchEnkeltOppdrag;
