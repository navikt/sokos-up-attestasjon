import React, { useRef, useState } from "react";
import { Link } from "react-router";
import { Pagination, Popover, SortState, Table } from "@navikt/ds-react";
import { PaginatedOppdragList } from "../../api/models/PaginatedDTO";
import RowsPerPageSelector from "../../components/RowsPerPageSelector";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";

interface TreffTabellProps {
  pagintatedOppdragList: PaginatedOppdragList;
  sokOppdrag: (page?: number, rows?: number) => void;
}

export default function TreffTabell(props: TreffTabellProps) {
  const { setOppdrag } = useStore();
  const [isSkjermet, setIsSkjermet] = useState(false);
  const [skjermingRow, setSkjermingRow] = useState<number | null>(null);
  const skjermingRowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [sort, setSort] = useState<ScopedSortState | undefined>();

  const rowsPerPage = props.pagintatedOppdragList.rows;
  const page = props.pagintatedOppdragList.page;
  const total = props.pagintatedOppdragList?.total ?? 0;
  const pagecount = Math.ceil(total / rowsPerPage);

  interface ScopedSortState extends SortState {
    orderBy: keyof (typeof props.pagintatedOppdragList.data)[0];
  }

  const handleSort = (sortKey: ScopedSortState["orderBy"]) => {
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

  const sortedData = props.pagintatedOppdragList.data.slice().sort((a, b) => {
    if (sort) {
      return sort.direction === "ascending"
        ? comparator(b, a, sort.orderBy)
        : comparator(a, b, sort.orderBy);
    }
    return 1;
  });

  return (
    <>
      <div className={commonstyles["sortable-table-topinfo"]}>
        <div className={commonstyles.nowrap}>
          <p>
            {`${total} treff`}
            {total > rowsPerPage && `, ${page} av ${pagecount} sider`}
          </p>
        </div>

        <RowsPerPageSelector
          rowsPerPage={rowsPerPage}
          sokOppdrag={props.sokOppdrag}
        />
      </div>

      <div className={commonstyles["sortable-table"]}>
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
            {sortedData.map((oppdrag, row) => (
              <Table.Row key={oppdrag.oppdragsId}>
                <Table.DataCell>
                  <Link
                    ref={(element) => (skjermingRowRefs.current[row] = element)}
                    to={oppdrag.erSkjermetForSaksbehandler ? "#" : "/detaljer"}
                    className={commonstyles.link}
                    onClick={() => {
                      if (oppdrag.erSkjermetForSaksbehandler) {
                        setSkjermingRow(row);
                        setIsSkjermet(!isSkjermet);
                      } else {
                        setOppdrag(oppdrag);
                      }
                    }}
                  >
                    {oppdrag.gjelderId}
                  </Link>
                </Table.DataCell>
                <Table.DataCell>{oppdrag.fagGruppe}</Table.DataCell>
                <Table.DataCell>{oppdrag.fagSystemId}</Table.DataCell>
                <Table.DataCell>{oppdrag.fagOmraade}</Table.DataCell>
                <Table.DataCell>{oppdrag.kostnadsSted}</Table.DataCell>
                <Table.DataCell>{oppdrag.ansvarsSted}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Popover
          open={isSkjermet}
          onClose={() => setIsSkjermet(false)}
          anchorEl={
            skjermingRow !== null
              ? skjermingRowRefs.current[skjermingRow]
              : null
          }
          flip={false}
          placement="right"
        >
          <Popover.Content>
            <div className={commonstyles["aksel-danger"]}>
              Denne personen er skjermet. Du har ikke tilgang.
            </div>
          </Popover.Content>
        </Popover>
      </div>

      {pagecount > 1 && (
        <div className={commonstyles["sortable-table-pagination"]}>
          <Pagination
            page={page}
            onPageChange={(page) => {
              props.sokOppdrag(page, rowsPerPage);
            }}
            count={pagecount}
            size="small"
            prevNextTexts
          />
        </div>
      )}
    </>
  );
}
