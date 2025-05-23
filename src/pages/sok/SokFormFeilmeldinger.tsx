import { useFormContext } from "react-hook-form";
import { ErrorSummary } from "@navikt/ds-react";
import styles from "./SokPage.module.css";

export default function SokFormFeilmeldinger() {
  const {
    formState: { errors },
  } = useFormContext();

  const filteredErrors = [...Object.keys(errors)].filter((m) => m);

  return (
    filteredErrors.length > 0 && (
      <div className={styles["sok__error-summary"]}>
        <ErrorSummary
          heading={"Du må fikse disse feilene før du kan fortsette"}
        >
          {filteredErrors.map((e) => (
            <ErrorSummary.Item key={e}>
              {(errors as { [key: string]: { message: string } })[e].message}
            </ErrorSummary.Item>
          ))}
        </ErrorSummary>
      </div>
    )
  );
}
