import { Oppdrag } from "../types/Oppdrag";
import { SokeParameter } from "../types/SokeParameter";
import { BASE_URI, axiosPostFetcher } from "./config/apiConfig";

export async function hentOppdrag(request: SokeParameter) {
  return await axiosPostFetcher<SokeParameter, Oppdrag[]>(
    BASE_URI.ATTESTASJON,
    "/sok",
    request,
  );
}
