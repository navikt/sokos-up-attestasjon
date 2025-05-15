import { HelpText, List } from "@navikt/ds-react";
import styles from "./SokPage.module.css";

export default function SokPageHelpText() {
  return (
    <div className={styles["attestasjonsok-helptext"]}>
      <HelpText title="Søkekriterier" placement="left" strategy="fixed">
        <List
          as="ul"
          size="small"
          title="Minimum ett av kriteriene må være utfylt"
        >
          <List.Item>Faggruppe og Ikke attestere</List.Item>
          <List.Item>Fagområde og Ikke attesterte</List.Item>
          <List.Item>Gjelder</List.Item>
          <List.Item>Fagsystem id (minst 4 tegn) og Fagområde</List.Item>
        </List>
      </HelpText>
    </div>
  );
}
