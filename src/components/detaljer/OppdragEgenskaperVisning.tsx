import { Oppdrag } from "../../types/Oppdrag";
import LabelText from "../common/LabelText";

export default function OppdragEgenskaperVisning({
  oppdrag,
}: {
  oppdrag: Oppdrag;
}) {
  return (
    <>
      <LabelText label="Gjelder" text={oppdrag.gjelderId} />
      <LabelText label="Fagsystem id" text={oppdrag.fagSystemId} />
      <LabelText label="Ansvarssted" text={oppdrag.ansvarsSted || ""} />
      <LabelText label="Kostnadssted" text={oppdrag.kostnadsSted || ""} />
      <LabelText label="Fagområde" text={oppdrag.fagOmraade} />
    </>
  );
}
