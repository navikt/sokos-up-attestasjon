import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Heading } from "@navikt/ds-react";
import { BASE_URI, axiosPostFetcher } from "../api/config/apiConfig";
import { AttesterOppdragResponse } from "../api/models/AttesterOppdragResponse";
import AlertWithCloseButton from "../components/common/AlertWithCloseButton";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ContentLoader from "../components/common/ContentLoader";
import LabelText from "../components/common/LabelText";
import {
  DetaljerTabell,
  StatefulLinje,
} from "../components/detaljer/DetaljerTabell";
import useOppdragsDetaljer from "../hooks/useOppdragDetaljer";
import commonstyles from "../styles/common-styles.module.css";
import { BASENAME } from "../util/constants";
import { createRequestPayload } from "../util/createRequestPayload";
import styles from "./DetaljerPage.module.css";

const DetaljerPage = () => {
  const location = useLocation();
  const oppdragsId = location.state.oppdragsId;
  const [isZosLoading, setIsZosLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [zosError, setZosError] = useState<string | null>(null);
  const [zosResponse, setResponse] = useState<AttesterOppdragResponse>();
  useEffect(() => {
    if (showAlert) setTimeout(() => setShowAlert(false), 10000);
  }, [showAlert]);

  if (!oppdragsId) window.location.replace(BASENAME);

  const { data, error, isLoading, mutate } = useOppdragsDetaljer(oppdragsId);

  const oppdragsdetalj = data?.at(0);
  const handleSubmit = async (linjerMedEndringer: StatefulLinje[]) => {
    if (linjerMedEndringer.filter((l) => !!l.error).length > 0) {
      setZosError("Du må rette feil i datoformat før du kan oppdatere");
      return;
    }

    const payload = createRequestPayload(
      oppdragsdetalj?.fagSystemId ?? "",
      oppdragsdetalj?.kodeFagOmraade ?? "",
      oppdragsdetalj?.gjelderId ?? "",
      oppdragsId,
      linjerMedEndringer.map((l) => l.linje),
      linjerMedEndringer,
    );

    setIsZosLoading(true);
    try {
      const response = await axiosPostFetcher<
        typeof payload,
        AttesterOppdragResponse
      >(BASE_URI.ATTESTASJON, "/attestere", payload);
      setResponse(response);
      setZosError(null);
      setShowAlert(true);
      mutate();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setZosError(`Error: ${error.response?.data?.message}`);
      } else {
        setZosError("En uventet feil har skjedd");
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
      {zosResponse && showAlert && (
        <div className={styles.detaljer__alert}>
          <AlertWithCloseButton variant="success">
            Oppdatering vellykket.{" "}
            {
              zosResponse.OSAttestasjonOperationResponse.Attestasjonskvittering
                .ResponsAttestasjon.AntLinjerMottatt
            }{" "}
            linjer oppdatert.
          </AlertWithCloseButton>
        </div>
      )}
      <div className={styles.detaljer}>
        <div className={styles.detaljer__top}>
          <Breadcrumbs searchLink trefflistelink detaljer />
          {oppdragsdetalj && (
            <div className={styles.detaljer__label}>
              <LabelText label="Gjelder" text={oppdragsdetalj.gjelderId} />
              <LabelText
                label="Fagsystem id"
                text={oppdragsdetalj.fagSystemId}
              />
              <LabelText
                label="Ansvarssted"
                text={oppdragsdetalj.ansvarsStedForOppdrag || ""}
              />
              <LabelText
                label="Kostnadssted"
                text={oppdragsdetalj.kostnadsStedForOppdrag || ""}
              />
              <LabelText label="Fagområde" text={oppdragsdetalj.fagOmraade} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.detaljer__tabell}>
        {zosError && (
          <div className={styles.detaljer__alert}>
            <Alert variant="error">{zosError}</Alert>
          </div>
        )}
        {data && (
          <DetaljerTabell
            antallAttestanter={oppdragsdetalj?.antallAttestanter ?? 1}
            handleSubmit={handleSubmit}
            isLoading={isLoading || isZosLoading}
            oppdragslinjer={data.reduce((a) => a).linjer}
            saksbehandlerIdent={oppdragsdetalj?.saksbehandlerIdent}
          />
        )}
      </div>
      {isLoading && <ContentLoader />}
      {error && <Alert variant="error">Problemer med å hente data</Alert>}
    </>
  );
};
export default DetaljerPage;
