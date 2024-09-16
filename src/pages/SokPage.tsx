import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert, Heading } from "@navikt/ds-react";
import { hentOppdrag } from "../api/config/apiService";
import SokForm from "../components/form/SokForm";
import { SokeData } from "../components/form/SokeSchema";
import commonstyles from "../styles/common-styles.module.css";
import { isEmpty, storeSok } from "../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const navigate = useNavigate();
  const [sokeData, setSokeData] = useState<SokeData | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setSokeData(undefined);
    storeSok();
  }, []);

  const handleChangeSok: SubmitHandler<SokeData> = (sokeData) => {
    setSokeData(sokeData);
    storeSok(sokeData);
    setIsLoading(true);
    setError(undefined);

    hentOppdrag(sokeData)
      .then((response) => {
        if (!isEmpty(response)) {
          navigate("/treffliste", { state: { sokeData, oppdrag: response } });
        } else {
          setError("Ingen treff på søket. Prøv igjen med andre søkekriterier.");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setError(
          "Noe gikk galt. Prøv igjen senere. Feilmelding: " + error.message,
        );
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon
        </Heading>
      </div>
      <div className={styles.sok_sok}>
        <Heading level="2" size="medium" spacing>
          Søk
        </Heading>
        <SokForm
          sokedata={sokeData}
          loading={isLoading}
          onSubmit={handleChangeSok}
        />
      </div>
      {error && (
        <div className={styles.sok_error}>
          <Alert variant="info">{error}</Alert>
        </div>
      )}
    </>
  );
}
