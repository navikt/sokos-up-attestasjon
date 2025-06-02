import { Heading, HelpText, List } from "@navikt/ds-react";
import styles from "./SokHelpText.module.css";

export default function SokHelpText() {
  return (
    <div className={styles["sok__help-text"]}>
      <HelpText title="Søkekriterier" placement="left" strategy="fixed">
        <Heading as="h3" size="small">
          Minimum ett av kriteriene må være utfylt
        </Heading>
        <List as="ul" size="small">
          <List.Item>Faggruppe og Ikke attestere</List.Item>
          <List.Item>Fagområde og Ikke attesterte</List.Item>
          <List.Item>Gjelder</List.Item>
          <List.Item>Fagsystem id (minst 4 tegn) og Fagområde</List.Item>
        </List>
      </HelpText>
    </div>
  );
}
