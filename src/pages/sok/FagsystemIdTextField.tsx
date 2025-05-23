import { useFormContext } from "react-hook-form";
import { TextField } from "@navikt/ds-react";
import styles from "./SokPage.module.css";

export default function FagsystemIdTextField() {
  const {
    register,
    formState: {
      errors: { fagSystemId },
    },
  } = useFormContext();

  return (
    <div className={styles["sok__fagsystem"]}>
      <TextField
        size={"small"}
        id="fagSystemId"
        label="Fagsystem id"
        {...register("fagSystemId")}
        error={fagSystemId?.message?.toString()}
      />
    </div>
  );
}
