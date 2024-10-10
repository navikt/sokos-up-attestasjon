import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Heading } from "@navikt/ds-react";
import {
  attesterOppdragRequest,
  oppdaterAttestasjon,
} from "../../api/apiService";
import { OppdaterAttestasjonResponse } from "../../api/models/AttesterOppdragResponse";
import AlertWithCloseButton from "../../components/AlertWithCloseButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import ContentLoader from "../../components/ContentLoader";
import useFetchOppdragsdetaljer from "../../hooks/useFetchOppdragsdetaljer";
import commonstyles from "../../styles/common-styles.module.css";
import { BASENAME } from "../../util/constants";
import styles from "./DetaljerPage.module.css";
import DetaljerTabell, { StatefulLinje } from "./DetaljerTabell";
import OppdragEgenskaperVisning from "./OppdragEgenskaperVisning";

export default function DetaljerPage() {
  const location = useLocation();
  const oppdrag = location.state.oppdrag;

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [isZosLoading, setIsZosLoading] = useState<boolean>(false);
  const [zosResponse, setZosResponse] = useState<OppdaterAttestasjonResponse>();

  const { data, error, isLoading, mutate } = useFetchOppdragsdetaljer(
    oppdrag.oppdragsId,
  );

  useEffect(() => {
    if (showAlert) setTimeout(() => setShowAlert(false), 10000);
  }, [showAlert]);

  if (!location.state) {
    window.location.replace(BASENAME);
  }

  async function handleSubmit(linjerMedEndringer: StatefulLinje[]) {
    if (linjerMedEndringer.filter((linje) => !!linje.dateError).length > 0) {
      setAlertError("Du må rette feil i datoformat før du kan oppdatere");
      return;
    }

    if (
      linjerMedEndringer.filter((linje) => linje.fjern || linje.attester)
        .length === 0
    ) {
      setAlertError("Du må velge minst en linje før du kan oppdatere");
      return;
    }

    const request = attesterOppdragRequest(
      oppdrag.fagSystemId ?? "",
      oppdrag.kodeFagOmraade ?? "",
      oppdrag.gjelderId,
      oppdrag.oppdragsId,
      linjerMedEndringer,
    );

    setIsZosLoading(true);
    try {
      const response = await oppdaterAttestasjon(request);
      setZosResponse(response);
      setAlertError(null);
      setShowAlert(true);
      mutate();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAlertError(`Error: ${error.response?.data?.message}`);
      } else {
        setAlertError("En uventet feil har skjedd");
      }
    } finally {
      if (!isLoading) {
        setIsZosLoading(false);
      }
    }
  }

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Detaljer
        </Heading>
      </div>
      <div className={styles["detaljer"]}>
        <div className={styles["detaljer-top"]}>
          <Breadcrumbs searchLink trefflistelink detaljer />
          {oppdrag && (
            <div className={styles["detaljer-label"]}>
              <OppdragEgenskaperVisning oppdrag={oppdrag} />
            </div>
          )}
          {zosResponse && showAlert && (
            <AlertWithCloseButton variant="success">
              {zosResponse.message}
            </AlertWithCloseButton>
          )}
        </div>
      </div>
      <div className={styles["detaljer-tabell"]}>
        {!!alertError && <Alert variant="error">{alertError}</Alert>}
        {data && (
          <DetaljerTabell
            antallAttestanter={oppdrag?.antallAttestanter ?? 1}
            handleSubmit={handleSubmit}
            isLoading={isLoading || isZosLoading}
            oppdragslinjer={data.linjer}
            saksbehandlerIdent={data.saksbehandlerIdent}
            setAlertError={setAlertError}
          />
        )}
      </div>
      {isLoading && <ContentLoader />}
      {error && <Alert variant="error">Problemer med å hente data</Alert>}
    </>
  );
}
