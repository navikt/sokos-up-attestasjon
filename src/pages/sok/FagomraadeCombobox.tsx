import { UNSAFE_Combobox } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";
import { useFetchFagomraader } from "../../api/apiService";
import type { FagOmraade } from "../../types/FagOmraade";

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

	function sortFagomraader(fagomraader: FagOmraade[]): FagOmraade[] {
		const prioritized = ["MOSALLE", "MPENBAL", "MSRBAL"];

		return [...fagomraader].sort((a, b) => {
			const aIndex = prioritized.indexOf(a.kodeFagomraade);
			const bIndex = prioritized.indexOf(b.kodeFagomraade);

			if (aIndex !== -1 && bIndex !== -1) {
				return aIndex - bIndex;
			}

			if (aIndex !== -1) {
				return -1;
			}

			if (bIndex !== -1) {
				return 1;
			}

			return a.kodeFagomraade.localeCompare(b.kodeFagomraade);
		});
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
		<UNSAFE_Combobox
			error={
				formState.errors.fagOmraade?.message ? "Ikke gyldig verdi" : undefined
			}
			isMultiSelect={false}
			size={"small"}
			label={"Fagområde"}
			onToggleSelected={(type, isSelected) => {
				if (isSelected) {
					const found = fagomraader?.find((f) => f.kodeFagomraade === type);
					setValue("fagOmraade", found, {
						shouldValidate: true,
						shouldDirty: true,
					});
					setValue("fagGruppe", undefined);
				} else {
					setValue("fagOmraade", undefined);
				}
			}}
			options={
				fagomraader
					? sortFagomraader(fagomraader).map(convertFagomraadeToComboboxValue)
					: []
			}
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
	);
}
