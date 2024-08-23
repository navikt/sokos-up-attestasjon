import { BASE_URI, axiosPostFetcher } from "../api/config/apiConfig";
import { GjelderIdRequest } from "../api/models/GjelderIdRequest";
import { GjelderNavn } from "../types/GjelderNavn";

export async function useHentNavn(request: GjelderIdRequest) {
  return await axiosPostFetcher<GjelderIdRequest, GjelderNavn>(
    BASE_URI.INTEGRATION,
    "/hentnavn",
    request,
  );
}
