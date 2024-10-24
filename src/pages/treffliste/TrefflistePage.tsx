import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { Heading } from "@navikt/ds-react";
import { hentNavn } from "../../api/apiService";
import Breadcrumbs from "../../components/Breadcrumbs";
import LabelText from "../../components/LabelText";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import { BASENAME } from "../../util/constants";
import TreffTabell from "./TreffTabell";
import styles from "./TrefflistePage.module.css";

export default function TrefflistePage() {
  const { storedOppdragList, storedSokeData } = useStore.getState();
  const { gjelderNavn, setGjelderNavn } = useStore(
    useShallow((state) => ({
      gjelderNavn: state.gjelderNavn,
      setGjelderNavn: state.setGjelderNavn,
    })),
  );

  function getAttestertStatusText() {
    if (storedSokeData?.attestertStatus === "true") {
      return "Attestert";
    } else if (storedSokeData?.attestertStatus === "false") {
      return "Ikke attestert";
    } else if (storedSokeData?.attestertStatus === "undefined") {
      return "Alle";
    } else {
      return "";
    }
  }

  useEffect(() => {
    if (!storedOppdragList) {
      window.location.replace(BASENAME);
    }

    if (!gjelderNavn) {
      hentNavn({ gjelderId: storedSokeData?.gjelderId }).then((response) => {
        setGjelderNavn(response.navn);
      });
    }
  }, [storedOppdragList, gjelderNavn, setGjelderNavn, storedSokeData]);

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
          <div className={styles.sokekriterier}>
            <Heading size={"small"} level={"2"}>
              Søkekriterier benyttet:
            </Heading>
            <div className={styles["sokekriterier-content"]}>
              <LabelText label={"Gjelder"} text={storedSokeData?.gjelderId} />
              <LabelText label={"Navn"} text={gjelderNavn} />
              <LabelText
                label={"Fagsystem id"}
                text={storedSokeData?.fagSystemId}
              />
              <LabelText
                label={"Faggruppe"}
                text={storedSokeData?.fagGruppe?.navn}
              />
              <LabelText
                label={"Fagområde"}
                text={storedSokeData?.fagOmraade?.navn}
              />
              <LabelText
                label={"Attestert status"}
                text={getAttestertStatusText()}
              />
            </div>
          </div>
        </div>

        <div className={styles["treffliste-trefftabell"]}>
          <TreffTabell oppdragList={storedOppdragList || []} />
        </div>
      </div>
    </>
  );
}
