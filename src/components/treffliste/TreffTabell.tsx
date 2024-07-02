import React from "react";
import { Link } from "react-router-dom";
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
          <Table.HeaderCell>Gjelder ID</Table.HeaderCell>
          <Table.HeaderCell>Faggruppe</Table.HeaderCell>
          <Table.HeaderCell>Fagsystem ID</Table.HeaderCell>
          <Table.HeaderCell>Fagområde</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {treffliste.map((oppdrag) => (
          <Table.Row key={oppdrag.oppdragsId}>
            <Table.DataCell>
              <Link to={`/oppdragslinjer/${oppdrag.oppdragsId}`}>
                {oppdrag.gjelderId}
              </Link>
            </Table.DataCell>
            <Table.DataCell>{oppdrag.navnFaggruppe}</Table.DataCell>
            <Table.DataCell>{oppdrag.fagsystemId}</Table.DataCell>
            <Table.DataCell>{oppdrag.navnFagomraade}</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
