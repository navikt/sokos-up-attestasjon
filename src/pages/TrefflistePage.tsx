import { useEffect, useState } from "react";
import { Alert, Heading } from "@navikt/ds-react";
import { BASE_URI, axiosPostFetcher } from "../api/config/apiConfig";
import { hentOppdrag } from "../api/config/apiService";
import { GjelderIdRequest } from "../api/models/GjelderIdRequest";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ContentLoader from "../components/common/ContentLoader";
import SokeKriterierVisning from "../components/treffliste/SokeKriterierVisning";
import { TreffTabell } from "../components/treffliste/TreffTabell";
import { useAppState } from "../store/AppState";
import commonstyles from "../styles/common-styles.module.css";
import { GjelderNavn } from "../types/GjelderNavn";
import { Oppdrag } from "../types/Oppdrag";
import { BASENAME } from "../util/constants";
import styles from "./TrefflistePage.module.css";

const TrefflistePage = () => {
  const [gjelderNavn, setGjelderNavn] = useState<string>("");
  const { storedSokeData } = useAppState.getState();
  const [storedOppdrag, setstoredOppdrag] = useState<Oppdrag[] | undefined>(
    useAppState.getState().storedOppdrag,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!storedOppdrag);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!storedSokeData) {
      window.location.replace(BASENAME);
    } else if (!storedOppdrag) {
      setIsLoading(true);
      hentOppdrag(storedSokeData)
        .then((response) => {
          setstoredOppdrag(response);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setError(error.message);
        });
    }
  }, [storedSokeData, storedOppdrag]);

  useEffect(() => {
    if (storedSokeData) {
      axiosPostFetcher<GjelderIdRequest, GjelderNavn>(
        BASE_URI.INTEGRATION,
        "/hentnavn",
        { gjelderId: storedSokeData?.gjelderId },
      ).then((response) => setGjelderNavn(response.navn));
    }
  }, [storedSokeData]);

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large">
          Attestasjon: Treffliste
        </Heading>
      </div>
      <div className={styles.treffliste}>
        <div className={styles.treffliste__top}>
          <Breadcrumbs searchLink treffliste />
          <SokeKriterierVisning
            gjelderNavn={gjelderNavn}
            sokeData={storedSokeData}
          />
        </div>
        {isLoading && <ContentLoader />}
        {error && (
          <div className={styles.treffliste__error}>
            <Alert variant="info">{error}</Alert>
          </div>
        )}
        {!isLoading && storedOppdrag && (
          <div className={styles.treffliste__trefftabell}>
            <TreffTabell treffliste={storedOppdrag || []} />
          </div>
        )}
      </div>
    </>
  );
};

export default TrefflistePage;
