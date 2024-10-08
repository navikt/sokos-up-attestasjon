import { SokeParameter } from "../../components/form/SokeSchema";
import { Oppdrag } from "../../types/Oppdrag";
import { BASE_URI, axiosPostFetcher } from "./apiConfig";

export async function hentOppdrag(request: SokeParameter) {
  return await axiosPostFetcher<SokeParameter, Oppdrag[]>(
    BASE_URI.ATTESTASJON,
    "/sok",
    request,
  );
}
