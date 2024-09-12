import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert, Heading } from "@navikt/ds-react";
import { hentOppdrag } from "../api/config/apiService";
import SokForm from "../components/form/SokForm";
import { SokeData } from "../components/form/SokeSchema";
import commonstyles from "../styles/common-styles.module.css";
import { clearSok, isEmpty, storeSok } from "../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const navigate = useNavigate();
  const [sokeData, setSokeData] = useState<SokeData | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    clearSok();
  }, []);

  const handleChangeSok: SubmitHandler<SokeData> = (sokeData) => {
    setSokeData(sokeData);
    storeSok(sokeData);
    setLoading(true);

    hentOppdrag(sokeData)
      .then((response) => {
        if (!isEmpty(response)) {
          navigate("/treffliste", { state: { sokeData } });
        } else {
          setError("Ingen treff på søket. Prøv igjen med andre søkekriterier.");
          setLoading(false);
        }
      })
      .catch((error) => {
        setError(
          "Noe gikk galt. Prøv igjen senere. Feilmelding: " + error.message,
        );
        setLoading(false);
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
          loading={loading}
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
