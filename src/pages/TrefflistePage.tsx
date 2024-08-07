import { Heading } from "@navikt/ds-react";
import ContentLoader from "../components/common/ContentLoader";
import { TreffTabell } from "../components/treffliste/TreffTabell";
import useSokOppdrag from "../hooks/useSokOppdrag";
import commonstyles from "../styles/common-styles.module.css";
import { retrieveSok } from "../util/commonUtils";
import styles from "./TreffListePage.module.css";

const TrefflistePage = () => {
  const { treffliste, isLoading } = useSokOppdrag(retrieveSok());

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large">
          Attestasjon
        </Heading>
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
