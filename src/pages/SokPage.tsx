import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { Alert, Heading } from "@navikt/ds-react";
import ContentLoader from "../components/common/ContentLoader";
import SokForm from "../components/form/SokForm";
import { SokeData } from "../components/form/SokeSchema";
import { TrefflisteSearchParameters } from "../models/TrefflisteSearchParameters";
import RestService from "../services/rest-service";
import commonstyles from "../util/common-styles.module.css";
import {
  anyOppdragExists,
  isEmpty,
  retrieveId,
  storeId,
} from "../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const { mutate } = useSWRConfig();
  const [trefflisteSokParameters, setTrefflisteSokParameters] =
    useState<TrefflisteSearchParameters>({
      gjelderID: retrieveId(),
    });

  const [shouldGoToTreffliste, setShouldGoToTreffliste] =
    useState<boolean>(false);

  const { treffliste, isLoading } = RestService.useFetchTreffliste(
    trefflisteSokParameters.gjelderID,
  );

  const handleChangeGjelderId: SubmitHandler<SokeData> = (data) => {
    const gjelderID = data.gjelderId?.replaceAll(/[\s.]/g, "") ?? "";
    setShouldGoToTreffliste(true);
    setTrefflisteSokParameters({ gjelderID: gjelderID });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (Array.isArray(treffliste) && !isEmpty(treffliste) && !isLoading) {
      const gjelderId = trefflisteSokParameters.gjelderID;
      storeId(gjelderId);
      if (anyOppdragExists(treffliste) && shouldGoToTreffliste) {
        navigate("/treffliste");
        setShouldGoToTreffliste(false);
      }
    }
  }, [
    treffliste,
    isLoading,
    navigate,
    trefflisteSokParameters,
    shouldGoToTreffliste,
  ]);

  useEffect(() => {
    mutate("/sok", []);
  }, [trefflisteSokParameters, mutate]);

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
        <SokForm onSubmit={handleChangeGjelderId} />
      </div>
      {isLoading && !!trefflisteSokParameters.gjelderID ? (
        <ContentLoader />
      ) : null}
      {!isLoading && !anyOppdragExists(treffliste) && (
        <Alert variant="info">
          Ingen treff. Denne ID'en har ingen oppdrag.
        </Alert>
      )}
    </>
  );
}
