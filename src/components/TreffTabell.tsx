import React from "react";
import { Table } from "@navikt/ds-react";
import { Oppdragsegenskaper } from "../models/Oppdragsegenskaper";

interface TreffTabellProps {
  treffliste: Oppdragsegenskaper[];
}

export const TreffTabell: React.FC<TreffTabellProps> = ({ treffliste }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Oppdrags ID</Table.HeaderCell>
          <Table.HeaderCell>Faggruppe</Table.HeaderCell>
          <Table.HeaderCell>Fagsystem ID</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {treffliste.map((o) => (
          <Table.Row key={o.oppdragsId}>
            <Table.DataCell>{o.oppdragsId}</Table.DataCell>
            <Table.DataCell>{o.navnFagGruppe}</Table.DataCell>
            <Table.DataCell>{o.fagsystemId}</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
