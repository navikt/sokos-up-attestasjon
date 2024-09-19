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

  const { data, error, isLoading, mutate } = useOppdragsDetaljer(
    oppdragsId.oppdragsId,
  );

  const oppdragsdetalj = data?.at(0);

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
        {data && (
          <DetaljerTabell
            oppdragslinjer={data.reduce((a) => a).linjer}
            gjelderId={oppdragsdetalj?.gjelderId}
            fagSystemId={oppdragsdetalj?.fagSystemId}
            kodeFagOmraade={oppdragsdetalj?.kodeFagOmraade}
            oppdragsId={oppdragsId.oppdragsId}
            mutate={mutate}
          />
        )}
      </div>
      {isLoading && <ContentLoader />}
      {error && <Alert variant="error">Problemer med å hente data</Alert>}
    </>
  );
};
export default DetaljerPage;
