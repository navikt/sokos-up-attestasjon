import { useEffect, useState } from "react";
import { Alert, Heading } from "@navikt/ds-react";
import { hentNavn, hentOppdrag } from "../../api/apiService";
import Breadcrumbs from "../../components/Breadcrumbs";
import ContentLoader from "../../components/ContentLoader";
import LabelText from "../../components/LabelText";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import { ErrorMessage } from "../../types/ErrorMessage";
import { SokeDataToSokeParameter } from "../../types/SokeParameter";
import { BASENAME } from "../../util/constants";
import TreffTabell from "./TreffTabell";
import styles from "./TrefflistePage.module.css";

export default function TrefflistePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const {
    storedPaginatedOppdragList,
    setStoredPaginatedOppdragList,
    storedSokeData,
    gjelderNavn,
    setGjelderNavn,
  } = useStore();

  function getAttestertStatusText() {
    if (storedSokeData?.attestertStatus === "true") {
      return "Attestert";
    } else if (storedSokeData?.attestertStatus === "false") {
      return "Ikke attestert";
    } else if (storedSokeData?.attestertStatus === "alle") {
      return "Alle";
    } else {
      return "";
    }
  }

  function sokOppdrag(page?: number, rows?: number) {
    setIsLoading(true);
    const sokeParameter = SokeDataToSokeParameter.parse(storedSokeData);
    hentOppdrag(sokeParameter, page, rows)
      .then((response) => {
        setIsLoading(false);
        setStoredPaginatedOppdragList(response);
      })
      .catch((error) => {
        setError({
          variant: "error",
          message: error.message,
        });
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (!storedPaginatedOppdragList) {
      window.location.replace(BASENAME);
    }

    if (storedSokeData?.gjelderId !== "" && !gjelderNavn) {
      hentNavn({ gjelderId: storedSokeData?.gjelderId }).then((response) => {
        setGjelderNavn(response.navn);
      });
    }
  }, [storedPaginatedOppdragList, gjelderNavn, setGjelderNavn, storedSokeData]);

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

        {isLoading && <ContentLoader />}
        {!isLoading && storedPaginatedOppdragList && (
          <TreffTabell
            pagintatedOppdragList={storedPaginatedOppdragList}
            sokOppdrag={sokOppdrag}
          />
        )}
      </div>

      {error && (
        <div className={styles["treffliste-error"]}>
          <Alert variant={error.variant} role="status">
            {error.message}
          </Alert>
        </div>
      )}
    </>
  );
}
