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
import { OppdragsDetaljerDTO } from "../../types/OppdragsDetaljerDTO";
import { SokeDataToSokeParameter } from "../../types/SokeParameter";
import { AttestertStatus } from "../../types/schema/AttestertStatus";
import { ROOT } from "../../util/routenames";
import DetaljerTabell from "./DetaljerTabell";

export default function DetaljerPage() {
  const navigate = useNavigate();
  const { oppdragDto, sokeData, setOppdragDtoList } = useStore();

  const antallAttestanter = oppdragDto?.antAttestanter ?? 1;
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    variant: "success" | "error" | "warning";
  } | null>(null);
  const [isZosLoading, setIsZosLoading] = useState<boolean>(false);

  const { data, isLoading, mutate } = useFetchOppdragsdetaljer(
    oppdragDto?.oppdragsId,
  );

  const linjerSomSkalVises: OppdragsDetaljerDTO | undefined = {
    ...data,
    saksbehandlerIdent: data?.saksbehandlerIdent ?? "",
    oppdragsLinjeList:
      data?.oppdragsLinjeList.filter((linje) => {
        if (sokeData && sokeData.alternativer === AttestertStatus.ATTESTERT) {
          return linje.oppdragsLinje.attestert;
        } else if (
          sokeData &&
          [
            AttestertStatus.IKKE_FERDIG_ATTESTERT_EKSL_EGNE,
            AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE,
          ].includes(sokeData.alternativer)
        ) {
          return !linje.oppdragsLinje.attestert;
        } // Hvis man har valgt EGNE_ATTESTERTE eller ALLE skal alle rader vises
        else return true;
      }) ?? [],
  };

  useEffect(() => {
    if (!oppdragDto) {
      navigate(ROOT, { replace: true });
    }
  }, [navigate, oppdragDto]);

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
      oppdragDto?.fagSystemId ?? "",
      oppdragDto?.kodeFagomraade ?? "",
      oppdragDto?.oppdragGjelderId ?? "",
      oppdragDto?.oppdragsId ?? 0,
      attestasjonlinjer,
    );

    setIsZosLoading(true);

    try {
      await oppdaterAttestasjon(request)
        .then((response) => {
          setAlertMessage({
            message: response.successMessage || "",
            variant: "success",
          });

          mutate();
        })
        .catch((error) => {
          setAlertMessage({ message: error.message, variant: "error" });
        });

      const sokeParameter = SokeDataToSokeParameter.parse(sokeData);
      await hentOppdrag(sokeParameter).then((res) => setOppdragDtoList(res));
    } finally {
      if (!isLoading) {
        setIsZosLoading(false);
      }
    }
  }

  return (
    <div className={commonstyles["page"]}>
      <div className={commonstyles["page__heading"]}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Detaljer
        </Heading>
      </div>
      <div className={commonstyles["page__top"]}>
        <Breadcrumbs searchLink trefflistelink detaljer />
        {oppdragDto && (
          <div className={commonstyles["sokekriterier"]}>
            <div className={commonstyles["sokekriterier__content"]}>
              <LabelText label="Gjelder" text={oppdragDto.oppdragGjelderId} />
              <LabelText label="Fagsystem id" text={oppdragDto.fagSystemId} />
              <LabelText label="Ansvarssted" text={oppdragDto.ansvarssted} />
              <LabelText label="Kostnadssted" text={oppdragDto.kostnadssted} />
              <LabelText label="Fagområde" text={oppdragDto.navnFagomraade} />
            </div>
          </div>
        )}
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
      {isLoading && <ContentLoader />}
      {linjerSomSkalVises && (
        <DetaljerTabell
          antallAttestanter={antallAttestanter}
          handleSubmit={handleSubmit}
          isLoading={isLoading || isZosLoading}
          oppdragsDetaljer={linjerSomSkalVises}
        />
      )}
    </div>
  );
}
