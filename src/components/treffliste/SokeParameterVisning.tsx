import { Heading } from "@navikt/ds-react";
import LabelText from "../common/LabelText";
import styles from "./SokeParameterVisning.module.css";

type SokekriterierProps = {
  gjelderId?: string;
  navn?: string;
  fagsystemId?: string;
  kodeFaggruppe?: string;
  kodeFagomraade?: string;
  attestertStatus?: string;
};

const SokeParameterVisning = ({
  gjelderId,
  navn,
  fagsystemId,
  kodeFaggruppe,
  kodeFagomraade,
  attestertStatus,
}: SokekriterierProps) => {
  let attestertStatusText;
  if (attestertStatus === "true") {
    attestertStatusText = "Attestert";
  } else if (attestertStatus === "false") {
    attestertStatusText = "Ikke attestert";
  } else if (attestertStatus === "null") {
    attestertStatusText = "Alle";
  } else {
    attestertStatusText = "";
  }

  return (
    <>
      <div className={styles.sokekriterier}>
        <Heading size={"small"} level={"2"}>
          Søkekriterier benyttet:
        </Heading>
        <div className={styles.sokekriterier__content}>
          {gjelderId && <LabelText label={"Gjelder ID"} text={gjelderId} />}
          {navn && <LabelText label={"Navn"} text={navn} />}
          {fagsystemId && (
            <LabelText label={"Fagsystem ID"} text={fagsystemId} />
          )}
          {kodeFaggruppe && (
            <LabelText label={"Faggruppe"} text={kodeFaggruppe} />
          )}
          {kodeFagomraade && (
            <LabelText label={"Fagområde"} text={kodeFagomraade} />
          )}
          <LabelText label={"Attestert status"} text={attestertStatusText} />
        </div>
      </div>
    </>
  );
};
export default SokeParameterVisning;
