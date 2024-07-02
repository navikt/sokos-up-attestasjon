import { useEffect } from "react";
import { Heading } from "@navikt/ds-react";
import ContentLoader from "../components/common/ContentLoader";
import { TreffTabell } from "../components/treffliste/TreffTabell";
import TrefflisteParameters from "../components/treffliste/TrefflisteParameters";
import RestService from "../services/rest-service";
import commonstyles from "../util/common-styles.module.css";
import { anyOppdragExists, retrieveId } from "../util/commonUtils";
import { BASENAME } from "../util/constants";
import styles from "./TrefflistePage.module.css";

const TrefflistePage = () => {
  const gjelderId = retrieveId();
  const { treffliste, isLoading } = RestService.useFetchTreffliste(gjelderId);

  useEffect(() => {
    if (!gjelderId) window.location.replace(BASENAME);
    if (isLoading) return;
    if (anyOppdragExists(treffliste)) return;
    window.location.replace(BASENAME);
  }, [treffliste, isLoading, gjelderId]);

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large">
          Attestasjon
        </Heading>
        <TrefflisteParameters gjelderId={gjelderId} />
      </div>
      <div className={styles.treffliste}>
        <div className={styles.treffliste__top}>
          <div className={styles.treffliste__top_info}>
            <Heading level="2" size="medium">
              Treffliste
            </Heading>
          </div>
        </div>
        {isLoading && <ContentLoader />}
        {!isLoading && treffliste && <TreffTabell treffliste={treffliste} />}
      </div>
    </>
  );
};

export default TrefflistePage;
