import { useLocation } from "react-router-dom";
import { Alert, Heading } from "@navikt/ds-react";
import ContentLoader from "../components/common/ContentLoader";
import LabelText from "../components/common/LabelText";
import { DetaljerTabell } from "../components/detaljer/DetaljerTabell";
import RestService from "../services/rest-service";
import commonstyles from "../util/common-styles.module.css";
import styles from "./DetaljerPage.module.css";

const DetaljerPage = () => {
  const location = useLocation();
  const oppdragsIder = location.state;

  const {
    data: attestasjonsegenskaper,
    isValidating,
    error,
  } = RestService.useFetchFlereOppdrag(oppdragsIder);

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Detaljer
        </Heading>
      </div>
      {isValidating && <ContentLoader />}
      {error && <Alert variant="error">Problemer med å hente data</Alert>}
      {attestasjonsegenskaper && (
        <>
          <div className={styles.attestasjondetaljer}></div>
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
