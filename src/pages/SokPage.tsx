import React, { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert, Heading } from "@navikt/ds-react";
import { hentOppdrag } from "../api/config/apiService";
import SokForm from "../components/form/SokForm";
import { SokeData } from "../components/form/SokeSchema";
import { useAppState } from "../store/AppState";
import commonstyles from "../styles/common-styles.module.css";
import { isEmpty } from "../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const navigate = useNavigate();
  const [sokeData, setSokeData] = useState<SokeData | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setStoredSokeData, setStoredOppdrag } = useAppState.getState();

  const handleChangeSok: SubmitHandler<SokeData> = (sokeData) => {
    setSokeData(sokeData);
    setStoredSokeData(sokeData);
    setIsLoading(true);
    setError(undefined);

    hentOppdrag(sokeData)
      .then((response) => {
        if (!isEmpty(response)) {
          setStoredOppdrag(response);
          navigate("/treffliste");
        } else {
          setError("Ingen treff på søket. Prøv igjen med andre søkekriterier.");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        setError(
          "Noe gikk galt. Prøv igjen senere. Feilmelding: " + errorMessage,
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
          isLoading={isLoading}
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
