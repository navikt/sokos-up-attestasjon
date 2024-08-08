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
  const oppdragsIder = location.state;
  if (!oppdragsIder) window.location.replace(BASENAME);

  const {
    data: attestasjonsegenskaper,
    error,
    isLoading,
  } = useOppdragsDetaljer(oppdragsIder);

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Detaljer
        </Heading>
      </div>
      <div className={styles.attestasjondetaljer}>
        <div className={styles.attestasjondetaljer__top}>
          <Breadcrumbs searchLink trefflistelink detaljer />
        </div>
      </div>
      {isLoading && <ContentLoader />}
      {error && <Alert variant="error">Problemer med å hente data</Alert>}
      {attestasjonsegenskaper && (
        <>
          {Array.isArray(attestasjonsegenskaper) &&
            attestasjonsegenskaper
              .filter((egenskap, index, self) => {
                const firstIndex = self.findIndex(
                  (item) => item.fagsystemId === egenskap.fagsystemId,
                );
                return firstIndex === index;
              })
              .map((egenskap, index) => (
                <>
                  <LabelText label="Fagsystem ID" text={egenskap.fagsystemId} />
                  <DetaljerTabell
                    key={index}
                    detaljerliste={attestasjonsegenskaper}
                    fagsystemId={egenskap.fagsystemId}
                  />
                </>
              ))}
        </>
      )}
    </>
  );
};
export default DetaljerPage;
