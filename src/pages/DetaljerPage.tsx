import { useLocation } from "react-router-dom";
import { Alert, Heading } from "@navikt/ds-react";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ContentLoader from "../components/common/ContentLoader";
import LabelText from "../components/common/LabelText";
import { DetaljerTabell } from "../components/detaljer/DetaljerTabell";
import useOppdragsDetaljer from "../hooks/useOppdragDetaljer";
import commonstyles from "../styles/common-styles.module.css";
import { BASENAME } from "../util/constants";
import styles from "./DetaljerPage.module.css";

const DetaljerPage = () => {
  const location = useLocation();
  const oppdragsId = location.state;
  if (!oppdragsId) window.location.replace(BASENAME);

  const { data, error, isLoading } = useOppdragsDetaljer(oppdragsId.oppdragsId);

  const firstEgenskap = data?.reduce((a) => a);

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Detaljer
        </Heading>
      </div>
      <div className={styles.detaljer}>
        <div className={styles.detaljer__top}>
          <Breadcrumbs searchLink trefflistelink detaljer />
          {firstEgenskap && (
            <div className={styles.detaljer__label}>
              <LabelText
                label="Gjelder ID"
                text={firstEgenskap.oppdragGjelderId}
              />
              <LabelText
                label="Fagsystem ID"
                text={firstEgenskap.fagSystemId}
              />
              <LabelText
                label="Ansvarssted"
                text={firstEgenskap.ansvarsStedForOppdrag || ""}
              />
              <LabelText
                label="Kostnadssted"
                text={firstEgenskap.kostnadsStedForOppdrag || ""}
              />
              <LabelText
                label="Fagområde"
                text={firstEgenskap.navnFagOmraade}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.detaljer__tabell}>
        {data && (
          <DetaljerTabell
            oppdragsdetaljer={data}
            oppdragGjelderId={firstEgenskap?.oppdragGjelderId}
            fagSystemId={firstEgenskap?.fagSystemId}
            navnFagOmraade={firstEgenskap?.navnFagOmraade}
            oppdragsId={oppdragsId.oppdragsId}
          />
        )}
      </div>
      {isLoading && <ContentLoader />}
      {error && <Alert variant="error">Problemer med å hente data</Alert>}
    </>
  );
};
export default DetaljerPage;
