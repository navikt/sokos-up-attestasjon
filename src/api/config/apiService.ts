import {
  SokeData,
  SokeRequestBody,
  mapToSokeRequestBody,
} from "../../components/form/SokeSchema";
import { Oppdrag } from "../../types/Oppdrag";
import { BASE_URI, axiosPostFetcher } from "./apiConfig";

export async function hentOppdrag(request: SokeData) {
  const sokeRequestBody = mapToSokeRequestBody(request);
  return await axiosPostFetcher<SokeRequestBody, Oppdrag[]>(
    BASE_URI.ATTESTASJON,
    "/sok",
    sokeRequestBody,
  );
}
