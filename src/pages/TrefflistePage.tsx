import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Heading } from "@navikt/ds-react";
import { BASE_URI, axiosPostFetcher } from "../api/config/apiConfig";
import { hentOppdrag } from "../api/config/apiService";
import { GjelderIdRequest } from "../api/models/GjelderIdRequest";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ContentLoader from "../components/common/ContentLoader";
import { SokeData } from "../components/form/SokeSchema";
import SokeParameterVisning from "../components/treffliste/SokeParameterVisning";
import { TreffTabell } from "../components/treffliste/TreffTabell";
import commonstyles from "../styles/common-styles.module.css";
import { GjelderNavn } from "../types/GjelderNavn";
import { Oppdrag } from "../types/Oppdrag";
import { retrieveSok } from "../util/commonUtils";
import { BASENAME } from "../util/constants";
import styles from "./TrefflistePage.module.css";

const TrefflistePage = () => {
  const location = useLocation();
  const [gjelderNavn, setGjelderNavn] = useState<string>("");
  const [sokeData] = useState<SokeData | undefined>(
    location.state?.sokeData || retrieveSok(),
  );
  const [oppdrag, setOppdrag] = useState<Oppdrag[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!sokeData) {
      window.location.replace(BASENAME);
    } else {
      setIsLoading(true);
      axiosPostFetcher<GjelderIdRequest, GjelderNavn>(
        BASE_URI.INTEGRATION,
        "/hentnavn",
        { gjelderId: sokeData?.gjelderId },
      ).then((resp) => setGjelderNavn(resp.navn));

      hentOppdrag(sokeData)
        .then((response) => {
          setOppdrag(response);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setError(error.message);
        });
    }
  }, [sokeData]);

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large">
          Attestasjon
        </Heading>
      </div>
      <div className={styles.treffliste}>
        <div className={styles.treffliste__top}>
          <Breadcrumbs searchLink treffliste />
          <SokeParameterVisning
            gjelderId={sokeData?.gjelderId}
            navn={gjelderNavn}
            fagsystemId={sokeData?.fagsystemId}
            kodeFaggruppe={sokeData?.kodeFaggruppe}
            kodeFagomraade={sokeData?.kodeFagomraade}
            attestertStatus={sokeData?.attestertStatus}
          />
        </div>
        {isLoading && <ContentLoader />}
        {error && (
          <div className={styles.treffliste__error}>
            <Alert variant="info">{error}</Alert>
          </div>
        )}
        {!isLoading && oppdrag && (
          <div className={styles.treffliste__trefftabell}>
            <TreffTabell treffliste={oppdrag || []} />
          </div>
        )}
      </div>
    </>
  );
};

export default TrefflistePage;
