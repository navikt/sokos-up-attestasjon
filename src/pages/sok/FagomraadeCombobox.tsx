import { useFormContext } from "react-hook-form";
import { UNSAFE_Combobox } from "@navikt/ds-react";
import { useFetchFagomraader } from "../../api/apiService";
import { FagOmraade } from "../../types/FagOmraade";
import styles from "./SokPage.module.css";

export default function FagomraadeCombobox() {
  const { data: fagomraader, isLoading: fagomraaderIsLoading } =
    useFetchFagomraader();

  const { formState, setValue, getValues } = useFormContext();

  function convertFagomraadeToComboboxValue(selectedFagomraade: FagOmraade) {
    return {
      value: selectedFagomraade.kodeFagomraade,
      label: `${selectedFagomraade.navnFagomraade}(${selectedFagomraade.kodeFagomraade})`,
    };
  }

  const fagomraadetypeLabelMap = fagomraader
    ? fagomraader.reduce(
        (map, fagomraade) => {
          map[fagomraade.kodeFagomraade] = fagomraade.navnFagomraade;
          return map;
        },
        {} as Record<string, string>,
      )
    : ({} as Record<string, string>);

  const field = getValues("fagOmraade");

  return (
    <div className={styles["sok__combobox"]}>
      <UNSAFE_Combobox
        error={
          formState.errors.fagOmraade?.message ? "Ikke gyldig verdi" : undefined
        }
        isMultiSelect={false}
        size={"small"}
        label={"Fagområde"}
        onToggleSelected={(type, isSelected) => {
          if (isSelected) {
            const found = fagomraader?.find((f) => f.kodeFagomraade == type);
            setValue("fagOmraade", found, {
              shouldValidate: true,
              shouldDirty: true,
            });
            setValue("fagGruppe", undefined);
          } else {
            setValue("fagOmraade", undefined);
          }
        }}
        options={fagomraader?.map(convertFagomraadeToComboboxValue) ?? []}
        selectedOptions={[
          {
            label: field
              ? fagomraadetypeLabelMap[field.kodeFagomraade] +
                ` (${field.kodeFagomraade})`
              : "",
            value: field?.kodeFagomraade ?? "",
          },
        ]}
        shouldAutocomplete={true}
        isLoading={fagomraaderIsLoading}
      ></UNSAFE_Combobox>
    </div>
  );
}
