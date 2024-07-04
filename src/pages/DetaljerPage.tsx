import { useParams } from "react-router-dom";
import { Heading } from "@navikt/ds-react";
import LabelText from "../components/common/LabelText";
import { DetaljerTabell } from "../components/detaljer/DetaljerTabell";
import RestService from "../services/rest-service";
import commonstyles from "../util/common-styles.module.css";
import styles from "./DetaljerPage.module.css";

type AttestasjonsdetaljerParams = {
  oppdragsID: string;
};
const DetaljerPage = () => {
  const { oppdragsID = "" } = useParams<AttestasjonsdetaljerParams>();
  const { data: attestasjonsegenskaper } =
    RestService.useFetchEnkeltOppdrag(oppdragsID);

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Detaljer
        </Heading>
      </div>
      {attestasjonsegenskaper && (
        <>
          <div className={styles.attestasjondetaljer}>
            <LabelText
              label="Gjelder ID"
              text={attestasjonsegenskaper[0].fagsystemId}
            />
            <LabelText
              label="Fagområde"
              text={attestasjonsegenskaper[0].navnFagomraade}
            />
            <LabelText
              label="Fagsystem ID"
              text={attestasjonsegenskaper[0].fagsystemId}
            />
          </div>
          <DetaljerTabell detaljerliste={attestasjonsegenskaper} />
        </>
      )}
    </>
  );
};
export default DetaljerPage;
