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
import { SokeDataToSokeParameter } from "../../types/SokeParameter";
import { ROOT } from "../../util/routenames";
import DetaljerTabell from "./DetaljerTabell";
import { filterLinjerByAttestertStatus } from "./detaljerUtils";

type AlertVariant = "success" | "error" | "warning";

export default function DetaljerPage() {
  const navigate = useNavigate();
  const { oppdragDto, sokeData, setOppdragDtoList } = useStore();

  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    variant: AlertVariant;
  } | null>(null);
  const [isZosLoading, setIsZosLoading] = useState(false);

  const { data, isLoading, mutate } = useFetchOppdragsdetaljer(
    oppdragDto?.oppdragsId,
  );

  useEffect(() => {
    if (!oppdragDto) {
      navigate(ROOT, { replace: true });
    }
  }, [navigate, oppdragDto]);

  const filteredLines = data?.oppdragsLinjeList.filter((linje) =>
    filterLinjerByAttestertStatus(linje, sokeData?.alternativer),
  );

  useEffect(() => {
    if (!isLoading && data && filteredLines?.length === 0) {
      navigate("/treffliste", { replace: true });
    }
  }, [isLoading, data, filteredLines?.length, navigate]);

  const validateAttestasjonlinjer = (
    attestasjonlinjer: AttestasjonlinjeList,
  ): string | null => {
    if (attestasjonlinjer.some((linje) => !!linje.properties.dateError)) {
      return "Du må rette feil i datoformat før du kan oppdatere";
    }

    if (
      !attestasjonlinjer.some(
        (linje) => linje.properties.fjern || linje.properties.attester,
      )
    ) {
      return "Du må velge minst en linje før du kan oppdatere";
    }

    return null;
  };

  const handleSubmit = async (attestasjonlinjer: AttestasjonlinjeList) => {
    const validationError = validateAttestasjonlinjer(attestasjonlinjer);
    if (validationError) {
      setAlertMessage({ message: validationError, variant: "error" });
      return;
    }

    if (!oppdragDto) return;

    const request = attesterOppdragRequest(
      oppdragDto.fagSystemId,
      oppdragDto.kodeFagomraade,
      oppdragDto.oppdragGjelderId,
      oppdragDto.oppdragsId,
      attestasjonlinjer,
    );

    setIsZosLoading(true);

    try {
      const response = await oppdaterAttestasjon(request);
      setAlertMessage({
        message: response.successMessage || "",
        variant: "success",
      });

      await mutate();

      if (sokeData) {
        const sokeParameter = SokeDataToSokeParameter.parse(sokeData);
        const oppdragList = await hentOppdrag(sokeParameter);
        setOppdragDtoList(oppdragList);
      }
    } catch (error) {
      setAlertMessage({
        message: error instanceof Error ? error.message : "En feil oppstod",
        variant: "error",
      });
    } finally {
      setIsZosLoading(false);
    }
  };

  if (!oppdragDto) return null;

  return (
    <div className={commonstyles["page"]}>
      <div className={commonstyles["page__top"]}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Detaljer
        </Heading>
        <Breadcrumbs searchLink trefflistelink detaljer />

        <div className={commonstyles["page__top-sokekriterier"]}>
          <Heading size="small" level="2">
            Søkekriterier benyttet:
          </Heading>
          <div className={commonstyles["page__top-sokekriterier__content"]}>
            <LabelText label="Gjelder" text={oppdragDto.oppdragGjelderId} />
            <LabelText label="Fagsystem id" text={oppdragDto.fagSystemId} />
            <LabelText label="Ansvarssted" text={oppdragDto.ansvarssted} />
            <LabelText label="Kostnadssted" text={oppdragDto.kostnadssted} />
            <LabelText label="Fagområde" text={oppdragDto.navnFagomraade} />
          </div>
        </div>
      </div>

      {alertMessage && (
        <AlertWithCloseButton
          show={true}
          setShow={() => setAlertMessage(null)}
          variant={alertMessage.variant}
        >
          {alertMessage.message}
        </AlertWithCloseButton>
      )}

      {isLoading && <ContentLoader />}

      {data && filteredLines && (
        <DetaljerTabell
          antallAttestanter={oppdragDto.antAttestanter ?? 1}
          handleSubmit={handleSubmit}
          isLoading={isLoading || isZosLoading}
          oppdragsDetaljer={{
            ...data,
            oppdragsLinjeList: filteredLines,
          }}
        />
      )}
    </div>
  );
}
