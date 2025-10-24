import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, HStack, Heading, TextField } from "@navikt/ds-react";
import { hentNavn } from "../../api/apiService";
import Breadcrumbs from "../../components/Breadcrumbs";
import LabelText from "../../components/LabelText";
import NoRecordsFound from "../../components/NoRecordsFound";
import { useStore } from "../../store/AppState";
import { selectedId } from "../../store/shared";
import commonstyles from "../../styles/common-styles.module.css";
import { AttestertStatus } from "../../types/schema/AttestertStatus";
import { ROOT } from "../../util/routenames";
import TreffTabell from "./TreffTabell";

export default function TrefflistePage() {
  const { oppdragDtoList, sokeData, gjelderNavn, setGjelderNavn } = useStore();
  const navigate = useNavigate();
  const [testId, setTestId] = useState("");

  function getAttestertStatusText() {
    if (
      sokeData?.alternativer === AttestertStatus.IKKE_FERDIG_ATTESTERT_EKSL_EGNE
    ) {
      return "Ikke ferdig attestert eksl. egne";
    } else if (
      sokeData?.alternativer === AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE
    ) {
      return "Ikke ferdig attestert inkl. egne";
    } else if (sokeData?.alternativer === AttestertStatus.ATTESTERT) {
      return "Attestert";
    } else if (sokeData?.alternativer === AttestertStatus.ALLE) {
      return "Alle";
    } else {
      return "Egne attesterte";
    }
  }

  useEffect(() => {
    if (!oppdragDtoList) {
      navigate(ROOT, { replace: true });
    }
  }, [navigate, oppdragDtoList]);

  useEffect(() => {
    if (sokeData?.gjelderId !== "" && !gjelderNavn) {
      hentNavn({ gjelderId: sokeData?.gjelderId }).then((response) => {
        setGjelderNavn(response.navn);
      });
    }
  }, [gjelderNavn, setGjelderNavn, sokeData]);

  const navigateToOppdragsinfo = (oppdragsId: string) => {
    selectedId.set(oppdragsId);
    window.location.href = "/oppdragsinfo";
  };

  const handleManualNavigation = () => {
    if (testId.trim()) {
      navigateToOppdragsinfo(testId.trim());
    }
  };

  return (
    <div className={commonstyles["page"]}>
      <div className={commonstyles["page__top"]}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Treffliste
        </Heading>
        <Breadcrumbs searchLink treffliste />
        <HStack gap="4" align="end">
          <TextField
            label="Gå til Oppdragsinfo"
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualNavigation()}
          />
          <Button onClick={handleManualNavigation} disabled={!testId.trim()}>
            Naviger
          </Button>
        </HStack>
        <div className={commonstyles["page__top-sokekriterier"]}>
          <Heading size={"small"} level={"2"}>
            Søkekriterier benyttet:
          </Heading>
          <div className={commonstyles["page__top-sokekriterier__content"]}>
            <LabelText label={"Gjelder"} text={sokeData?.gjelderId} />
            <LabelText label={"Navn"} text={gjelderNavn} />
            <LabelText label={"Fagsystem id"} text={sokeData?.fagSystemId} />
            <LabelText label={"Faggruppe"} text={sokeData?.fagGruppe?.type} />
            <LabelText
              label={"Fagområde"}
              text={sokeData?.fagOmraade?.kodeFagomraade}
            />
            <LabelText
              label={"Attestert status"}
              text={getAttestertStatusText()}
            />
          </div>
        </div>
      </div>

      {oppdragDtoList && <TreffTabell oppdragDtoList={oppdragDtoList} />}
      {oppdragDtoList && oppdragDtoList.length === 0 && (
        <NoRecordsFound buttonText="Gå tilbake til Søk" navigateTo="/" />
      )}
    </div>
  );
}
