import useFetchEnkeltOppdrag from "./hooks/useFetchEnkeltOppdrag";
import useFetchFaggrupper from "./hooks/useFetchFaggrupper";
import useFetchFlereOppdrag from "./hooks/useFetchFlereOppdrag";
import useFetchTreffliste from "./hooks/useFetchTreffliste";

const RestService = {
  useFetchFaggrupper,
  useFetchEnkeltOppdrag,
  useFetchTreffliste,
  useFetchFlereOppdrag,
};

export default RestService;
