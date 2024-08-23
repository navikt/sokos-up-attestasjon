import React from "react";
import { Link } from "react-router-dom";
import { Table } from "@navikt/ds-react";
import { Oppdrag } from "../../types/Oppdrag";

interface TreffTabellProps {
  treffliste: Oppdrag[];
}

export const TreffTabell: React.FC<TreffTabellProps> = ({ treffliste }) => {
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
          {treffliste.map((oppdrag) => (
            <Table.Row>
              <Table.DataCell key={oppdrag.oppdragsId}>
                <Link
                  to="/detaljer"
                  state={{ oppdragsIder: [oppdrag.oppdragsId] }}
                >
                  {oppdrag.gjelderId}
                </Link>
              </Table.DataCell>
              <Table.DataCell>{oppdrag.navnFagGruppe}</Table.DataCell>
              <Table.DataCell>{oppdrag.fagsystemId}</Table.DataCell>
              <Table.DataCell>{oppdrag.navnFagOmraade}</Table.DataCell>
              <Table.DataCell>{oppdrag.kostnadsSted}</Table.DataCell>
              <Table.DataCell>{oppdrag.ansvarsSted}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
