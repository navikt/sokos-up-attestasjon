import { EyeSlashIcon } from "@navikt/aksel-icons";
import {
	HStack,
	Pagination,
	type SortState,
	Table,
	Tag,
} from "@navikt/ds-react";
import { useState } from "react";
import { Link } from "react-router";
import RowsPerPageSelector from "../../components/RowsPerPageSelector";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import type { OppdragDTOList } from "../../types/Oppdrag";
import { logUserEvent, TREFFLISTE } from "../../umami/umami";
import styles from "./TreffTabell.module.css";

interface TreffTabellProps {
	oppdragDtoList: OppdragDTOList;
}

export default function TreffTabell(props: TreffTabellProps) {
	interface ScopedSortState extends SortState {
		orderBy: keyof (typeof props.oppdragDtoList)[0];
	}

	const { setOppdragDto } = useStore();
	const [sort, setSort] = useState<ScopedSortState | undefined>();
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState<number>(25);

	const pagecount = Math.ceil(props.oppdragDtoList.length / rowsPerPage);

	const antall = props.oppdragDtoList.length ?? 0;

	const handleSort = (sortKey: ScopedSortState["orderBy"]) => {
		logUserEvent(TREFFLISTE.SORTER, { sortKey: sortKey });
		setSort(
			sort && sortKey === sort.orderBy && sort.direction === "descending"
				? undefined
				: {
						orderBy: sortKey,
						direction:
							sort && sortKey === sort.orderBy && sort.direction === "ascending"
								? "descending"
								: "ascending",
					},
		);
	};

	function comparator<T>(a: T, b: T, orderBy: keyof T): number {
		if (b[orderBy] == null || b[orderBy] < a[orderBy]) {
			return -1;
		}
		if (b[orderBy] > a[orderBy]) {
			return 1;
		}
		return 0;
	}

	const sortedData = props.oppdragDtoList.slice().sort((a, b) => {
		if (sort) {
			return sort.direction === "ascending"
				? comparator(b, a, sort.orderBy)
				: comparator(a, b, sort.orderBy);
		}
		return 1;
	});

	const pageData = sortedData.slice(
		(page - 1) * rowsPerPage,
		page * rowsPerPage,
	);

	function updateRowsPerPage(rows: number) {
		setRowsPerPage(rows);
		setPage(1);
	}

	return (
		<div className={commonstyles["table-container"]}>
			<RowsPerPageSelector
				rowsPerPage={rowsPerPage}
				updateRowsPerPage={updateRowsPerPage}
				totalCount={antall}
				currentPage={page}
				pageCount={pagecount}
			/>

			<div className={commonstyles.table}>
				<Table
					sort={sort}
					onSortChange={(sortKey) =>
						handleSort(sortKey as ScopedSortState["orderBy"])
					}
				>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader sortKey={"gjelderId"} sortable>
								Gjelder
							</Table.ColumnHeader>
							<Table.ColumnHeader sortKey={"fagGruppe"} sortable>
								Faggruppe
							</Table.ColumnHeader>
							<Table.ColumnHeader sortKey={"fagSystemId"} sortable>
								Fagsystem id
							</Table.ColumnHeader>
							<Table.ColumnHeader sortKey={"fagOmraade"} sortable>
								Fagområde
							</Table.ColumnHeader>
							<Table.ColumnHeader sortKey={"kostnadsSted"}>
								Kostnadssted
							</Table.ColumnHeader>
							<Table.ColumnHeader sortKey={"ansvarsSted"}>
								Ansvarssted
							</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{pageData.map((oppdrag) => (
							<Table.Row
								key={btoa(`${oppdrag.oppdragsId}`)}
								className={
									oppdrag.erSkjermetForSaksbehandler
										? styles["skjermet-rad"]
										: undefined
								}
							>
								{" "}
								<Table.DataCell>
									{oppdrag.erSkjermetForSaksbehandler ? (
										<HStack align="center" gap="space-8" as="span">
											{oppdrag.oppdragGjelderId}
											<Tag variant="outline" data-color="warning" size="small">
												<EyeSlashIcon aria-label="Skjermet" />
												Skjermet
											</Tag>
										</HStack>
									) : (
										<Link
											to="/detaljer"
											className={commonstyles.link}
											replace
											onClick={() => {
												setOppdragDto(oppdrag);
											}}
										>
											{oppdrag.oppdragGjelderId}
										</Link>
									)}
								</Table.DataCell>
								<Table.DataCell>{oppdrag.navnFaggruppe}</Table.DataCell>
								<Table.DataCell>{oppdrag.fagSystemId}</Table.DataCell>
								<Table.DataCell>
									{oppdrag.kodeFagomraade} ({oppdrag.navnFagomraade})
								</Table.DataCell>
								<Table.DataCell>{oppdrag.kostnadssted}</Table.DataCell>
								<Table.DataCell>{oppdrag.ansvarssted}</Table.DataCell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>

			{pagecount > 1 && (
				<div className={commonstyles.table__pagination}>
					<Pagination
						page={page}
						onPageChange={setPage}
						count={pagecount}
						size="small"
						prevNextTexts
					/>
				</div>
			)}
		</div>
	);
}
