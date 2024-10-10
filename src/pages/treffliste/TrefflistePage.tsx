import { useEffect } from "react";
import { Heading } from "@navikt/ds-react";
import { hentNavn } from "../../api/apiService";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import { BASENAME } from "../../util/constants";
import SokeKriterierVisning from "./SokeKriterierVisning";
import TreffTabell from "./TreffTabell";
import styles from "./TrefflistePage.module.css";

const TrefflistePage = () => {
  const { storedOppdrag, storedSokeData } = useStore.getState();
  const { gjelderNavn, setGjelderNavn } = useStore((state) => ({
    gjelderNavn: state.gjelderNavn,
    setGjelderNavn: state.setGjelderNavn,
  }));

  useEffect(() => {
    if (!storedOppdrag) {
      window.location.replace(BASENAME);
    }

    if (!gjelderNavn) {
      hentNavn({ gjelderId: storedSokeData?.gjelderId }).then((response) => {
        setGjelderNavn(response.navn);
      });
    }
  }, [storedOppdrag, gjelderNavn, setGjelderNavn, storedSokeData]);

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large">
          Attestasjon: Treffliste
        </Heading>
      </div>
      <div className={styles["treffliste"]}>
        <div className={styles["treffliste-top"]}>
          <Breadcrumbs searchLink treffliste />
          <SokeKriterierVisning
            gjelderNavn={gjelderNavn}
            sokeData={storedSokeData}
          />
        </div>

        <div className={styles["treffliste-trefftabell"]}>
          <TreffTabell oppdragListe={storedOppdrag || []} />
        </div>
      </div>
    </>
  );
};

export default TrefflistePage;
