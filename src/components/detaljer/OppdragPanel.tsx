import styles from "../../pages/DetaljerPage.module.css";
import { Oppdrag } from "../../types/Oppdrag";
import { retrieveId } from "../../util/commonUtils";
import LabelText from "../common/LabelText";

interface OppdragsEgenskapPanelProps {
  oppdrag: Oppdrag;
}

export default function OppdragsEgenskapPanel(
  props: OppdragsEgenskapPanelProps,
) {
  const gjelderId = retrieveId();

  return (
    <div className={styles.detaljer__columns}>
      <div className={styles.detaljer__column}>
        <LabelText label={"Gjelder ID"} text={gjelderId} />
        <LabelText label={"Fagsystem ID"} text={props.oppdrag.fagsystemId} />
      </div>
      <div className={styles.detaljer__column}>
        <LabelText label={"Navn"} text={"Test"} />
        <LabelText label={"Oppdrags ID"} text={props.oppdrag.oppdragsId} />
      </div>
      <div className={styles.detaljer__column}>
        <LabelText label={"Fagområde"} text={props.oppdrag.navnFagOmraade} />
      </div>
    </div>
  );
}
