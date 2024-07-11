import useSWR from "swr";
import { Faggruppe } from "../../models/Faggruppe";
import { axiosFetcher, swr } from "../config/api";
import { BASE_URI } from "../config/config";

const useFetchFaggrupper = () => {
  const { data, error, isValidating } = useSWR<Faggruppe[]>(
    `/faggrupper`,
    swr<Faggruppe[]>((url) =>
      axiosFetcher<Faggruppe[]>(BASE_URI.OPPDRAGSINFO, url),
    ),
  );
  const isLoading = (!error && !data) || isValidating;

  return { data, error, isLoading };
};
export default useFetchFaggrupper;
