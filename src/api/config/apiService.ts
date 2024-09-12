import { SokeData } from "../../components/form/SokeSchema";
import { Oppdrag } from "../../types/Oppdrag";
import { BASE_URI, axiosPostFetcher } from "./apiConfig";

export async function hentOppdrag(request: SokeData) {
  return await axiosPostFetcher<SokeData, Oppdrag[]>(
    BASE_URI.ATTESTASJON,
    "/sok",
    request,
  );
}
