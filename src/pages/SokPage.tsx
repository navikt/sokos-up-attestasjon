import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { Alert, Heading } from "@navikt/ds-react";
import ContentLoader from "../components/common/ContentLoader";
import SokForm from "../components/form/SokForm";
import { SokeData } from "../components/form/SokeSchema";
import RestService from "../services/rest-service";
import commonstyles from "../util/common-styles.module.css";
import { isEmpty, retrieveSok, storeSok } from "../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();
  const [sokedata, setSokedata] = useState<SokeData | undefined>(retrieveSok);
  const [error, setError] = useState<string | undefined>(undefined);

  const { treffliste, isLoading } = RestService.useFetchTreffliste(sokedata);
  const [shouldGoToTreffliste, setShouldGoToTreffliste] =
    useState<boolean>(false);

  const handleChangeSok: SubmitHandler<SokeData> = (sokedata) => {
    storeSok(sokedata);
    setSokedata(sokedata);
    setShouldGoToTreffliste(true);
  };

  useEffect(() => {
    if (
      Array.isArray(treffliste) &&
      !isEmpty(treffliste) &&
      !isLoading &&
      shouldGoToTreffliste
    ) {
      navigate("/treffliste");
      setShouldGoToTreffliste(false);
    } else if (isEmpty(treffliste) && !isLoading && shouldGoToTreffliste) {
      setError("Ingen treff på søket");
      setShouldGoToTreffliste(false);
    }
  }, [isLoading, navigate, shouldGoToTreffliste, treffliste]);

  useEffect(() => {
    mutate("/sok", []);
  }, [sokedata, mutate]);

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
        <SokForm sokedata={sokedata} onSubmit={handleChangeSok} />
      </div>
      {sokedata && isLoading && <ContentLoader />}
      {error && (
        <div className={styles.sok_error}>
          <Alert variant="info">{error}</Alert>
        </div>
      )}
    </>
  );
}
