import { Heading, TextField } from "@navikt/ds-react";
import commonstyles from "../util/common-styles.module.css";
import styles from "./SokPage.module.css";

export default function SokPage() {
  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon
        </Heading>
      </div>
      <div className={styles.sok_sok}>
        <Heading level="2" size="medium" spacing>
          Søk
        </Heading>
        <div className={styles.sok_inputfields}>
          <TextField label="Gjelder ID" />
          <TextField label="Behandlende enhet" />
          <TextField label="Fagsystem ID" />
        </div>
      </div>
    </>
  );
}
