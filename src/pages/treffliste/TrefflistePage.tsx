import { useEffect } from "react";
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
  const { oppdragList, sokeData, gjelderNavn, setGjelderNavn } = useStore();

  function getAttestertStatusText() {
    if (sokeData?.attestertStatus === "true") {
      return "Attestert";
    } else if (sokeData?.attestertStatus === "false") {
      return "Ikke attestert";
    } else if (sokeData?.attestertStatus === "alle") {
      return "Alle";
    } else {
      return "";
    }
  }

  useEffect(() => {
    if (!oppdragList) {
      window.location.replace(BASENAME);
    }

    if (sokeData?.gjelderId !== "" && !gjelderNavn) {
      hentNavn({ gjelderId: sokeData?.gjelderId }).then((response) => {
        setGjelderNavn(response.navn);
      });
    }
  }, [oppdragList, gjelderNavn, setGjelderNavn, sokeData]);

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
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
              <LabelText label={"Gjelder"} text={sokeData?.gjelderId} />
              <LabelText label={"Navn"} text={gjelderNavn} />
              <LabelText label={"Fagsystem id"} text={sokeData?.fagSystemId} />
              <LabelText label={"Faggruppe"} text={sokeData?.fagGruppe?.type} />
              <LabelText
                label={"Fagområde"}
                text={sokeData?.fagOmraade?.kode}
              />
              <LabelText
                label={"Attestert status"}
                text={getAttestertStatusText()}
              />
            </div>
          </div>
        </div>

        {oppdragList && <TreffTabell oppdragList={oppdragList} />}
      </div>
    </>
  );
}
