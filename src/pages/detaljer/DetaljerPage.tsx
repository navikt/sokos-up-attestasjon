import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Heading } from "@navikt/ds-react";
import {
  attesterOppdragRequest,
  hentOppdrag,
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
import { OppdragsDetaljer } from "../../types/OppdragsDetaljer";
import { SokeDataToSokeParameter } from "../../types/SokeParameter";
import { DETALJER, logUmamiEvent } from "../../umami/umami";
import { ROOT } from "../../util/constants";
import styles from "./DetaljerPage.module.css";
import DetaljerTabell from "./DetaljerTabell";

export default function DetaljerPage() {
  const navigate = useNavigate();
  const { oppdrag, sokeData, setOppdragList } = useStore();

  const antallAttestanter = oppdrag?.antallAttestanter ?? 1;
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    variant: "success" | "error" | "warning";
  } | null>(null);
  const [isZosLoading, setIsZosLoading] = useState<boolean>(false);

  const { data, isLoading, mutate } = useFetchOppdragsdetaljer(
    oppdrag?.oppdragsId,
  );

  const linjerSomSkalVises: OppdragsDetaljer | undefined = {
    ...data,
    saksbehandlerIdent: data?.saksbehandlerIdent ?? "",
    linjer:
      data?.linjer.filter((linje) => {
        if (sokeData?.alternativer === "3") {
          return linje.oppdragsLinje.attestert;
        } else if (
          sokeData?.alternativer === "1" ||
          sokeData?.alternativer === "2"
        ) {
          return !linje.oppdragsLinje.attestert;
        } else return true;
      }) ?? [],
  };

  useEffect(() => {
    if (!oppdrag) {
      navigate(ROOT);
    }
  }, [navigate, oppdrag]);

  async function handleSubmit(attestasjonlinjer: AttestasjonlinjeList) {
    if (
      attestasjonlinjer.filter(
        (attestasjonlinje) => !!attestasjonlinje.properties.dateError,
      ).length > 0
    ) {
      setAlertMessage({
        message: "Du må rette feil i datoformat før du kan oppdatere",
        variant: "error",
      });
      return;
    }

    if (
      attestasjonlinjer.filter(
        (linje) => linje.properties.fjern || linje.properties.attester,
      ).length === 0
    ) {
      setAlertMessage({
        message: "Du må velge minst en linje før du kan oppdatere",
        variant: "error",
      });
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
      await oppdaterAttestasjon(request)
        .then((response) => {
          setAlertMessage({
            message: response.message || "",
            variant: "success",
          });

          if (
            attestasjonlinjer.filter((linje) => linje.properties.attester)
              .length > 0
          ) {
            logUmamiEvent(DETALJER.ATTESTERT);
          }
          if (
            attestasjonlinjer.filter((linje) => linje.properties.fjern).length >
            0
          ) {
            logUmamiEvent(DETALJER.AVATTESTERT);
          }

          mutate();
        })
        .catch((error) => {
          logUmamiEvent(DETALJER.ERROR);
          setAlertMessage({ message: error, variant: "error" });
        });

      const sokeParameter = SokeDataToSokeParameter.parse(sokeData);
      await hentOppdrag(sokeParameter).then((res) => setOppdragList(res));
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
        </div>
        <div className={styles["detaljer-alerts"]}>
          {!!alertMessage && (
            <AlertWithCloseButton
              show={!!alertMessage}
              setShow={() => setAlertMessage(null)}
              variant={alertMessage.variant}
            >
              {alertMessage.message}
            </AlertWithCloseButton>
          )}{" "}
        </div>
      </div>
      {isLoading && <ContentLoader />}
      {linjerSomSkalVises && (
        <DetaljerTabell
          antallAttestanter={antallAttestanter}
          handleSubmit={handleSubmit}
          isLoading={isLoading || isZosLoading}
          oppdragsDetaljer={linjerSomSkalVises}
        />
      )}
    </>
  );
}
