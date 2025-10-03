import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Alert, Heading } from "@navikt/ds-react";
import { hentNavn } from "../../api/apiService";
import Breadcrumbs from "../../components/Breadcrumbs";
import LabelText from "../../components/LabelText";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import { AttestertStatus } from "../../types/schema/AttestertStatus";
import { ROOT } from "../../util/routenames";
import TreffTabell from "./TreffTabell";

export default function TrefflistePage() {
  const { oppdragDtoList, sokeData, gjelderNavn, setGjelderNavn } = useStore();
  const navigate = useNavigate();

  const getAttestertStatusText = () => {
    switch (sokeData?.alternativer) {
      case AttestertStatus.IKKE_FERDIG_ATTESTERT_EKSL_EGNE:
        return "Ikke ferdig attestert eksl. egne";
      case AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE:
        return "Ikke ferdig attestert inkl. egne";
      case AttestertStatus.ATTESTERT:
        return "Attestert";
      case AttestertStatus.ALLE:
        return "Alle";
      case AttestertStatus.EGEN_ATTESTERTE:
        return "Egne attesterte";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (!oppdragDtoList) {
      navigate(ROOT, { replace: true });
    }
  }, [navigate, oppdragDtoList]);

  useEffect(() => {
    if (sokeData?.gjelderId && !gjelderNavn) {
      hentNavn({ gjelderId: sokeData.gjelderId }).then((response) => {
        setGjelderNavn(response.navn);
      });
    }
  }, [gjelderNavn, setGjelderNavn, sokeData]);

  const hasNoResults = oppdragDtoList && oppdragDtoList.length === 0;

  if (!oppdragDtoList) return null;

  return (
    <div className={commonstyles["page"]}>
      <div className={commonstyles["page__top"]}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Treffliste
        </Heading>
        <Breadcrumbs searchLink treffliste />
        <div className={commonstyles["page__top-sokekriterier"]}>
          <Heading size="small" level="2">
            Søkekriterier benyttet:
          </Heading>
          <div className={commonstyles["page__top-sokekriterier__content"]}>
            <LabelText label="Gjelder" text={sokeData?.gjelderId} />
            <LabelText label="Navn" text={gjelderNavn} />
            <LabelText label="Fagsystem id" text={sokeData?.fagSystemId} />
            <LabelText label="Faggruppe" text={sokeData?.fagGruppe?.type} />
            <LabelText
              label="Fagområde"
              text={sokeData?.fagOmraade?.kodeFagomraade}
            />
            <LabelText
              label="Attestert status"
              text={getAttestertStatusText()}
            />
          </div>
        </div>
      </div>

      {hasNoResults ? (
        <Alert variant="info">
          <Heading spacing size="small" level="3">
            Alle attestasjoner for dette søket er ferdig behandlet
          </Heading>
          Du kan gjøre et nytt søk eller endre søkekriteriene.
        </Alert>
      ) : (
        <TreffTabell oppdragDtoList={oppdragDtoList} />
      )}
    </div>
  );
}
