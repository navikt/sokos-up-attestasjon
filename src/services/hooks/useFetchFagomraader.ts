import useSWR from "swr";
import { Fagomraade } from "../../models/Fagomraade";
import { axiosFetcher, swr } from "../config/api";
import { BASE_URI } from "../config/config";

const useFetchFagomraader = () => {
  const { data, error, isValidating } = useSWR<Fagomraade[]>(
    `/fagomraader`,
    swr<Fagomraade[]>((url) =>
      axiosFetcher<Fagomraade[]>(BASE_URI.ATTESTASJON, url),
    ),
  );
  const isLoading = (!error && !data) || isValidating;

  return { data, error, isLoading };
};
export default useFetchFagomraader;
