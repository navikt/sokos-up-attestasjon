import { useFormContext } from "react-hook-form";
import { UNSAFE_Combobox } from "@navikt/ds-react";
import { useFetchFaggrupper } from "../../api/apiService";
import { FagGruppe } from "../../types/FagGruppe";
import styles from "./SokPage.module.css";

export default function FaggruppeCombobox() {
  const { data: faggrupper, isLoading: faggrupperIsLoading } =
    useFetchFaggrupper();
  const { getValues, formState, setValue } = useFormContext();

  const faggruppetypeLabelMap = faggrupper
    ? faggrupper.reduce(
        (map, faggruppe) => {
          map[faggruppe.type] = faggruppe.navn;
          return map;
        },
        {} as Record<string, string>,
      )
    : ({} as Record<string, string>);

  function convertFaggruppeToComboboxValue(selectedFaggruppe: FagGruppe) {
    return {
      value: selectedFaggruppe.type,
      label: `${selectedFaggruppe.navn}(${selectedFaggruppe.type})`,
    };
  }

  const field = getValues("fagGruppe");

  return (
    <div className={styles["sok__combobox"]}>
      <UNSAFE_Combobox
        error={
          formState.errors.fagGruppe?.message ? "Ikke gyldig verdi" : undefined
        }
        isMultiSelect={false}
        size={"small"}
        label={"Faggruppe"}
        onToggleSelected={(type, isSelected) => {
          if (isSelected) {
            const found = faggrupper?.find((f) => f.type == type);
            setValue("fagGruppe", found, {
              shouldValidate: true,
              shouldDirty: true,
            });
            setValue("fagOmraade", undefined);
          } else {
            setValue("fagGruppe", undefined);
          }
        }}
        options={faggrupper?.map(convertFaggruppeToComboboxValue) ?? []}
        selectedOptions={[
          {
            label: field
              ? faggruppetypeLabelMap[field.type] + ` (${field.type})`
              : "",
            value: field?.type ?? "",
          },
        ]}
        shouldAutocomplete={true}
        isLoading={faggrupperIsLoading}
      ></UNSAFE_Combobox>
    </div>
  );
}
