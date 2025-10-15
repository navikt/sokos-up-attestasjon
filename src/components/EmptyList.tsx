import { Button, Heading } from "@navikt/ds-react";
import styles from "./EmptyList.module.css";

export default function EmptyList() {
  return (
    <div className={styles.container}>
      <Heading size="medium" spacing align="center">
        Listen er tom. Alle radene er behandlet.
      </Heading>
      <Button size="small" className={styles.button}>
        Gå tilbake til søk
      </Button>
    </div>
  );
}
