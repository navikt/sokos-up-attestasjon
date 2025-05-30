import { useFormContext } from "react-hook-form";
import { TextField } from "@navikt/ds-react";
import styles from "./SokPage.module.css";

export default function GjelderIdTextField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles["attestasjonsok-gjelder"]}>
      <TextField
        label="Gjelder"
        size={"small"}
        error={
          errors.gjelderId?.message && (
            <span className={styles["attestasjonsok-error-message-nowrap"]}>
              {errors.gjelderId?.message?.toString()}
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
