import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert, Heading } from "@navikt/ds-react";
import { hentOppdrag } from "../api/config/apiService";
import ContentLoader from "../components/common/ContentLoader";
import SokForm from "../components/form/SokForm";
import { SokeData } from "../components/form/SokeSchema";
import commonstyles from "../styles/common-styles.module.css";
import { isEmpty, storeSok } from "../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const navigate = useNavigate();
  const [sokedata, setSokedata] = useState<SokeData | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangeSok: SubmitHandler<SokeData> = (sokedata) => {
    setSokedata(sokedata);
    storeSok(sokedata);
    setLoading(true);

    hentOppdrag(sokedata)
      .then((response) => {
        if (!isEmpty(response)) {
          navigate("/treffliste");
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
          sokedata={sokedata}
          loading={loading}
          onSubmit={handleChangeSok}
        />
      </div>
      {sokedata && loading && <ContentLoader />}
      {error && (
        <div className={styles.sok_error}>
          <Alert variant="info">{error}</Alert>
        </div>
      )}
    </>
  );
}
