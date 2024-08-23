import { useEffect } from "react";
import { Heading } from "@navikt/ds-react";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ContentLoader from "../components/common/ContentLoader";
import SokeParameterVisning from "../components/treffliste/SokeParameterVisning";
import { TreffTabell } from "../components/treffliste/TreffTabell";
import { useHentNavn } from "../hooks/useHentNavn";
import useSokOppdrag from "../hooks/useSokOppdrag";
import commonstyles from "../styles/common-styles.module.css";
import {
  retrieveId,
  retrieveNavn,
  retrieveSok,
  storeNavn,
} from "../util/commonUtils";
import { BASENAME } from "../util/constants";
import styles from "./TrefflistePage.module.css";

const TrefflistePage = () => {
  const sokeData = retrieveSok();
  if (!sokeData) window.location.replace(BASENAME);
  const { treffliste, isLoading } = useSokOppdrag(retrieveSok());
  const gjelderId = retrieveId();
  const gjelderNavn = retrieveNavn();

  const hentNavn = useHentNavn({ gjelderId });

  useEffect(() => {
    if (gjelderNavn === "") {
      hentNavn.then((navn) => {
        storeNavn(navn.navn);
      });
    }
  }, [gjelderNavn, hentNavn]);

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
        {!isLoading && treffliste && (
          <div className={styles.treffliste__trefftabell}>
            <TreffTabell treffliste={treffliste} />
          </div>
        )}
      </div>
    </>
  );
};

export default TrefflistePage;
