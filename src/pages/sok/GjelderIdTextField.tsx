import { useFormContext } from "react-hook-form";
import { TextField } from "@navikt/ds-react";
import styles from "./SokPage.module.css";

export default function GjelderIdTextField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles["sok__gjelder"]}>
      <TextField
        label="Gjelder"
        size={"small"}
        error={
          errors.gjelderId?.message && (
            <span className={styles["sok__error--nowrap"]}>
              9 eller 11 siffer
            </span>
          )
        }
        id="gjelderId"
        {...register("gjelderId", {
          setValueAs: (value: string) => value.trim(),
        })}
      />
    </div>
  );
}
