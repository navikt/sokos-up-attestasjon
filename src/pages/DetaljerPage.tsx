import { useLocation } from "react-router-dom";
import { Heading } from "@navikt/ds-react";
import LabelText from "../components/common/LabelText";
import { DetaljerTabell } from "../components/detaljer/DetaljerTabell";
import RestService from "../services/rest-service";
import commonstyles from "../util/common-styles.module.css";
import styles from "./DetaljerPage.module.css";

const DetaljerPage = () => {
  const location = useLocation();
  const data = location.state;

  const {
    data: attestasjonsegenskaper,
    isValidating,
    error,
  } = RestService.useFetchFlereOppdrag(data);

  // Handle loading state
  if (isValidating) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Detaljer
        </Heading>
      </div>
      {attestasjonsegenskaper && (
        <>
          <div className={styles.attestasjondetaljer}></div>
          {Array.isArray(attestasjonsegenskaper) &&
            attestasjonsegenskaper.map((egenskap, index) => (
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
