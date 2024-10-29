import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Popover, Table } from "@navikt/ds-react";
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

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Gjelder</Table.HeaderCell>
            <Table.HeaderCell>Faggruppe</Table.HeaderCell>
            <Table.HeaderCell>Fagsystem ID</Table.HeaderCell>
            <Table.HeaderCell>Fagområde</Table.HeaderCell>
            <Table.HeaderCell>Kostnadssted</Table.HeaderCell>
            <Table.HeaderCell>Ansvarssted</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.oppdragList.map((oppdrag, index) => (
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
