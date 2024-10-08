import { Heading } from "@navikt/ds-react";
import LabelText from "../../components/LabelText";
import { SokeData } from "../../types/SokeData";
import styles from "./SokeKriterierVisning.module.css";

type SokeKriterierVisningProps = {
  gjelderNavn: string;
  sokeData?: SokeData;
};

export default function SokeKriterierVisning({
  gjelderNavn,
  sokeData,
}: SokeKriterierVisningProps) {
  let attestertStatusText;
  if (sokeData?.attestertStatus === "true") {
    attestertStatusText = "Attestert";
  } else if (sokeData?.attestertStatus === "false") {
    attestertStatusText = "Ikke attestert";
  } else if (sokeData?.attestertStatus === "undefined") {
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
        <div className={styles["sokekriterier-content"]}>
          {sokeData?.gjelderId && (
            <LabelText label={"Gjelder"} text={sokeData.gjelderId} />
          )}
          {gjelderNavn && <LabelText label={"Navn"} text={gjelderNavn} />}
          {sokeData?.fagSystemId && (
            <LabelText label={"Fagsystem id"} text={sokeData.fagSystemId} />
          )}
          {sokeData?.fagGruppe && (
            <LabelText label={"Faggruppe"} text={sokeData.fagGruppe.navn} />
          )}
          {sokeData?.fagOmraade && (
            <LabelText label={"Fagområde"} text={sokeData.fagOmraade.navn} />
          )}
          <LabelText label={"Attestert status"} text={attestertStatusText} />
        </div>
      </div>
    </>
  );
}
