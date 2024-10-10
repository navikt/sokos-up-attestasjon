import { Heading } from "@navikt/ds-react";
import LabelText from "../../components/LabelText";
import { SokeData } from "../../types/SokeData";
import styles from "./SokeKriterierVisning.module.css";

type SokeKriterierVisningProps = {
  gjelderNavn: string;
  sokeData?: SokeData;
};

export default function SokeKriterierVisning(props: SokeKriterierVisningProps) {
  function getAttestertStatusText() {
    if (props.sokeData?.attestertStatus === "true") {
      return "Attestert";
    } else if (props.sokeData?.attestertStatus === "false") {
      return "Ikke attestert";
    } else if (props.sokeData?.attestertStatus === "undefined") {
      return "Alle";
    } else {
      return "";
    }
  }

  return (
    <>
      <div className={styles.sokekriterier}>
        <Heading size={"small"} level={"2"}>
          Søkekriterier benyttet:
        </Heading>
        <div className={styles["sokekriterier-content"]}>
          {props.sokeData?.gjelderId && (
            <LabelText label={"Gjelder"} text={props.sokeData.gjelderId} />
          )}
          {props.gjelderNavn && (
            <LabelText label={"Navn"} text={props.gjelderNavn} />
          )}
          {props.sokeData?.fagSystemId && (
            <LabelText
              label={"Fagsystem id"}
              text={props.sokeData.fagSystemId}
            />
          )}
          {props.sokeData?.fagGruppe && (
            <LabelText
              label={"Faggruppe"}
              text={props.sokeData.fagGruppe.navn}
            />
          )}
          {props.sokeData?.fagOmraade && (
            <LabelText
              label={"Fagområde"}
              text={props.sokeData.fagOmraade.navn}
            />
          )}
          <LabelText
            label={"Attestert status"}
            text={getAttestertStatusText()}
          />
        </div>
      </div>
    </>
  );
}
