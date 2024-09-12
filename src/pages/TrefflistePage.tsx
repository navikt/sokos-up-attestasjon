import { useEffect, useState } from "react";
import { Heading } from "@navikt/ds-react";
import { BASE_URI, axiosPostFetcher } from "../api/config/apiConfig";
import { GjelderIdRequest } from "../api/models/GjelderIdRequest";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ContentLoader from "../components/common/ContentLoader";
import { SokeData } from "../components/form/SokeSchema";
import SokeParameterVisning from "../components/treffliste/SokeParameterVisning";
import { TreffTabell } from "../components/treffliste/TreffTabell";
import useSokOppdrag from "../hooks/useSokOppdrag";
import commonstyles from "../styles/common-styles.module.css";
import { GjelderNavn } from "../types/GjelderNavn";
import { retrieveSok } from "../util/commonUtils";
import { BASENAME } from "../util/constants";
import styles from "./TrefflistePage.module.css";

const TrefflistePage = () => {
  const [gjelderNavn, setGjelderNavn] = useState<string>("");
  const [sokeData, setSokeData] = useState<SokeData | undefined>(undefined);

  useEffect(() => {
    const storedSokeData = retrieveSok();
    if (!storedSokeData) window.location.replace(BASENAME);
    axiosPostFetcher<GjelderIdRequest, GjelderNavn>(
      BASE_URI.INTEGRATION,
      "/hentnavn",
      { gjelderId: storedSokeData?.gjelderId },
    ).then((resp) => setGjelderNavn(resp.navn));
    setSokeData(storedSokeData);
  }, []);

  const { data, isLoading } = useSokOppdrag(sokeData);

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
        {!isLoading && data && (
          <div className={styles.treffliste__trefftabell}>
            <TreffTabell treffliste={data} />
          </div>
        )}
      </div>
    </>
  );
};

export default TrefflistePage;
