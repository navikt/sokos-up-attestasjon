import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Heading } from "@navikt/ds-react";
import {
  attesterOppdragRequest,
  oppdaterAttestasjon,
  useFetchOppdragsdetaljer,
} from "../../api/apiService";
import AlertWithCloseButton from "../../components/AlertWithCloseButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import ContentLoader from "../../components/ContentLoader";
import LabelText from "../../components/LabelText";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import { AttestasjonlinjeList } from "../../types/Attestasjonlinje";
import { OppdaterAttestasjonResponse } from "../../types/OppdaterAttestasjonResponse";
import { ROOT } from "../../util/constants";
import styles from "./DetaljerPage.module.css";
import DetaljerTabell from "./DetaljerTabell";

export default function DetaljerPage() {
  const navigate = useNavigate();
  const { oppdrag } = useStore.getState();

  const antallAttestanter = oppdrag?.antallAttestanter ?? 1;
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [isZosLoading, setIsZosLoading] = useState<boolean>(false);
  const [zosResponse, setZosResponse] = useState<OppdaterAttestasjonResponse>();

  const {
    data: oppdragsDetaljer,
    error,
    isLoading,
    mutate,
  } = useFetchOppdragsdetaljer(oppdrag?.oppdragsId);

  useEffect(() => {
    if (!oppdrag) {
      navigate(ROOT);
    }
  }, [navigate, oppdrag]);

  useEffect(() => {
    if (showAlert) setTimeout(() => setShowAlert(false), 10000);
  }, [showAlert]);

  async function handleSubmit(attestasjonlinjer: AttestasjonlinjeList) {
    if (
      attestasjonlinjer.filter(
        (attestasjonlinje) => !!attestasjonlinje.properties.dateError,
      ).length > 0
    ) {
      setAlertError("Du må rette feil i datoformat før du kan oppdatere");
      return;
    }

    if (
      attestasjonlinjer.filter(
        (linje) => linje.properties.fjern || linje.properties.attester,
      ).length === 0
    ) {
      setAlertError("Du må velge minst en linje før du kan oppdatere");
      return;
    }

    const request = attesterOppdragRequest(
      oppdrag?.fagSystemId ?? "",
      oppdrag?.kodeFagOmraade ?? "",
      oppdrag?.gjelderId ?? "",
      oppdrag?.oppdragsId ?? 0,
      attestasjonlinjer,
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
              <LabelText label="Gjelder" text={oppdrag.gjelderId} />
              <LabelText label="Fagsystem id" text={oppdrag.fagSystemId} />
              <LabelText label="Ansvarssted" text={oppdrag.ansvarsSted} />
              <LabelText label="Kostnadssted" text={oppdrag.kostnadsSted} />
              <LabelText label="Fagområde" text={oppdrag.fagOmraade} />
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
        {oppdragsDetaljer && (
          <DetaljerTabell
            antallAttestanter={antallAttestanter}
            handleSubmit={handleSubmit}
            isLoading={isLoading || isZosLoading}
            oppdragsDetaljer={oppdragsDetaljer}
            setAlertError={setAlertError}
          />
        )}
      </div>
      {isLoading && <ContentLoader />}
      {error && <Alert variant="error">Problemer med å hente data</Alert>}
    </>
  );
}
