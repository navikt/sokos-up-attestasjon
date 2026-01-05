import { Button, Modal, Table } from "@navikt/ds-react";
import { useRef } from "react";
import { DETALJER } from "../../umami/umami";
import { formaterTilNorskTall } from "../../util/commonUtils";

type SumModalProps = {
	tittel: string;
	sum: {
		sumPerKlassekode: Record<string, number>;
		totalsum: number;
	};
};

export default function SumModal({ tittel, sum }: SumModalProps) {
	const ref = useRef<HTMLDialogElement>(null);

	const handleClick = () => {
		ref.current?.showModal();
	};

	return (
		<div>
			<Button
				data-umami-event={DETALJER.SUM_MODAL_OPENED}
				data-umami-event-tittel={tittel}
				variant="secondary"
				size="small"
				onClick={handleClick}
				disabled={
					sum.sumPerKlassekode &&
					Object.entries(sum.sumPerKlassekode).length === 0
				}
			>
				{tittel}
			</Button>

			<Modal ref={ref} header={{ heading: tittel }}>
				<Modal.Body>
					<Table zebraStripes>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell scope="col">Klassekode</Table.HeaderCell>
								<Table.HeaderCell scope="col">Sum</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{sum.sumPerKlassekode &&
								Object.entries(sum.sumPerKlassekode).map(
									([klassekode, sum]) => (
										<Table.Row key={klassekode}>
											<Table.DataCell>{klassekode}</Table.DataCell>
											<Table.DataCell align="right">
												{formaterTilNorskTall(sum)}
											</Table.DataCell>
										</Table.Row>
									),
								)}
							<Table.Row>
								<Table.DataCell>Totalt</Table.DataCell>
								<Table.DataCell align="right">
									{formaterTilNorskTall(sum.totalsum)}
								</Table.DataCell>
							</Table.Row>
						</Table.Body>
					</Table>
				</Modal.Body>
				<Modal.Footer>
					<Button type="button" onClick={() => ref.current?.close()}>
						Lukk
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
