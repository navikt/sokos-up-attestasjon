import { useFormContext } from "react-hook-form";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { AttestertStatus } from "../../types/schema/AttestertStatus";
import styles from "./SokPage.module.css";

export default function StatuserRadioButtons() {
  const { register } = useFormContext();

  return (
    <div className={styles["attestasjonsok-radiobutton"]}>
      <RadioGroup
        legend="Status"
        name="alternativer"
        defaultValue={AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE}
        size={"small"}
      >
        <Radio
          value={AttestertStatus.IKKE_FERDIG_ATTESTERT_EKSL_EGNE}
          {...register("alternativer")}
        >
          Ikke ferdig attestert eksl. egne
        </Radio>
        <Radio
          value={AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE}
          {...register("alternativer")}
        >
          Ikke ferdig attestert inkl. egne
        </Radio>
        <Radio value={AttestertStatus.ATTESTERT} {...register("alternativer")}>
          Attestert
        </Radio>
        <Radio value={AttestertStatus.ALLE} {...register("alternativer")}>
          Alle
        </Radio>
        <Radio
          value={AttestertStatus.EGEN_ATTESTERTE}
          {...register("alternativer")}
        >
          Egne attesterte
        </Radio>
      </RadioGroup>
    </div>
  );
}
