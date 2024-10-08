import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Heading } from "@navikt/ds-react";
import { BASE_URI, axiosPostFetcher } from "../../api/config/apiConfig";
import { AttesterOppdragResponse } from "../../api/models/AttesterOppdragResponse";
import AlertWithCloseButton from "../../components/AlertWithCloseButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import ContentLoader from "../../components/ContentLoader";
import useOppdragsDetaljer from "../../hooks/useOppdragDetaljer";
import { useAppState } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import { BASENAME } from "../../util/constants";
import { createRequestPayload } from "../../util/createRequestPayload";
import styles from "./DetaljerPage.module.css";
import { DetaljerTabell, StatefulLinje } from "./DetaljerTabell";
import OppdragEgenskaperVisning from "./OppdragEgenskaperVisning";

const DetaljerPage = () => {
  const location = useLocation();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [isZosLoading, setIsZosLoading] = useState<boolean>(false);
  const [zosResponse, setResponse] = useState<AttesterOppdragResponse>();
  useEffect(() => {
    if (showAlert) setTimeout(() => setShowAlert(false), 10000);
  }, [showAlert]);

  if (!location.state) {
    window.location.replace(BASENAME);
  }

  const oppdragsId = location.state.oppdragsId;
  const { data, error, isLoading, mutate } = useOppdragsDetaljer(oppdragsId);
  const { storedOppdrag } = useAppState.getState();

  const oppdrag = storedOppdrag?.find(
    (oppdrag) => oppdrag.oppdragsId === oppdragsId,
  );

  const handleSubmit = async (linjerMedEndringer: StatefulLinje[]) => {
    if (linjerMedEndringer.filter((l) => !!l.dateError).length > 0) {
      setAlertError("Du må rette feil i datoformat før du kan oppdatere");
      return;
    }

    if (linjerMedEndringer.filter((l) => l.fjern || l.attester).length === 0) {
      setAlertError("Du må velge minst en linje før du kan oppdatere");
      return;
    }

    const payload = createRequestPayload(
      oppdrag?.fagSystemId ?? "",
      oppdrag?.kodeFagOmraade ?? "",
      oppdrag?.gjelderId ?? "",
      oppdragsId,
      linjerMedEndringer,
    );

    setIsZosLoading(true);
    try {
      const response = await axiosPostFetcher<
        typeof payload,
        AttesterOppdragResponse
      >(BASE_URI.ATTESTASJON, "/attestere", payload);
      setResponse(response);
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
      setIsZosLoading(false);
    }
  };

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
              Oppdatering vellykket.{" "}
              {
                zosResponse.OSAttestasjonOperationResponse
                  .Attestasjonskvittering.ResponsAttestasjon.AntLinjerMottatt
              }{" "}
              linjer oppdatert.
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
};
export default DetaljerPage;
