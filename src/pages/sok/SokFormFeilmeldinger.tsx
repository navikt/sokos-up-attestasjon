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
          {filteredErrors.map((fieldName) => (
            <ErrorSummary.Item key={fieldName} href={`#${fieldName}`}>
              {
                (errors as { [key: string]: { message: string } })[fieldName]
                  .message
              }
            </ErrorSummary.Item>
          ))}
        </ErrorSummary>
      </div>
    )
  );
}
