import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Popover, SortState, Table } from "@navikt/ds-react";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import { OppdragList } from "../../types/Oppdrag";

interface TreffTabellProps {
  oppdragList: OppdragList;
}

export default function TreffTabell(props: TreffTabellProps) {
  const { setOppdrag } = useStore();
  const [openState, setOpenState] = useState(false);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [sort, setSort] = useState<ScopedSortState | undefined>();

  interface ScopedSortState extends SortState {
    orderBy: keyof (typeof props.oppdragList)[0];
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

  const sortedData = props.oppdragList.slice().sort((a, b) => {
    if (sort) {
      return sort.direction === "ascending"
        ? comparator(b, a, sort.orderBy)
        : comparator(a, b, sort.orderBy);
    }
    return 1;
  });

  return (
    <>
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
          {sortedData.map((oppdrag, index) => (
            <Table.Row key={oppdrag.oppdragsId}>
              <Table.DataCell>
                <Link
                  ref={(el) => (rowRefs.current[index] = el)}
                  to={oppdrag.erSkjermetForSaksbehandler ? "#" : "/detaljer"}
                  className={commonstyles.link}
                  onClick={() => {
                    if (oppdrag.erSkjermetForSaksbehandler) {
                      setActiveRow(index);
                      setOpenState(!openState);
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
        open={openState}
        onClose={() => setOpenState(false)}
        anchorEl={activeRow !== null ? rowRefs.current[activeRow] : null}
        flip={false}
        placement="right"
      >
        <Popover.Content>
          <div className={commonstyles["aksel-danger"]}>
            Denne personen er skjermet. Du har ikke tilgang.
          </div>
        </Popover.Content>
      </Popover>
    </>
  );
}
