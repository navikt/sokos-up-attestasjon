import { Table } from "@navikt/ds-react";
import type React from "react";
import type { PropsWithChildren } from "react";
import type { Attestasjonlinje } from "../../types/Attestasjonlinje";
import ExpandableRow from "./ExpandableRow";

type RowWrapperProps = PropsWithChildren & {
	linje: Attestasjonlinje;
	index: number;
	openRows: Record<number, boolean>;
	handleRowToggle: (index: number, open: boolean) => void;
	handleTextFieldChange: (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number,
		linje: Attestasjonlinje,
	) => void;
	toggleCheckbox: (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number,
		linje: Attestasjonlinje,
		type: "fjern" | "attester",
	) => void;
};

const RowWrapper: React.FC<RowWrapperProps> = ({
	linje,
	children,
	index,
	openRows,
	handleRowToggle,
}) => {
	if (!linje.properties.vises) return <Table.Row>{children}</Table.Row>;
	else
		return (
			<Table.ExpandableRow
				content={<ExpandableRow data={linje} />}
				togglePlacement="right"
				expandOnRowClick
				key={index}
				open={openRows[index] || false}
				onOpenChange={(open) => handleRowToggle(index, open)}
				selected={
					linje.attestant ? linje.properties.fjern : linje.properties.attester
				}
			>
				{children}
			</Table.ExpandableRow>
		);
};

export default RowWrapper;
