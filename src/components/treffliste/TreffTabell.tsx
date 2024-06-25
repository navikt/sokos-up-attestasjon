import React from "react";
import { Table } from "@navikt/ds-react";
import { AttestasjonTreff } from "../../models/AttestasjonTreff";

interface TreffTabellProps {
  treffliste: AttestasjonTreff[];
}

export const TreffTabell: React.FC<TreffTabellProps> = ({ treffliste }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Oppdrags ID</Table.HeaderCell>
          <Table.HeaderCell>Faggruppe</Table.HeaderCell>
          <Table.HeaderCell>Fagsystem ID</Table.HeaderCell>
          <Table.HeaderCell>Fagområde</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {treffliste.map((o) => (
          <Table.Row key={o.oppdragsId}>
            <Table.DataCell>{o.oppdragsId}</Table.DataCell>
            <Table.DataCell>{o.navnFaggruppe}</Table.DataCell>
            <Table.DataCell>{o.fagsystemId}</Table.DataCell>
            <Table.DataCell>{o.navnFagomraade}</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
