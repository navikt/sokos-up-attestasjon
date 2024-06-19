import React from "react";
import { Table } from "@navikt/ds-react";
import { Attestasjonsdata } from "../models/Attestasjonsdata";

interface TreffTabellProps {
  treffliste: Attestasjonsdata[];
}

export const TreffTabell: React.FC<TreffTabellProps> = ({ treffliste }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Oppdrags ID</Table.HeaderCell>
          <Table.HeaderCell>Faggruppe</Table.HeaderCell>
          <Table.HeaderCell>Fagsystem ID</Table.HeaderCell>
          <Table.HeaderCell>Antall attestanter</Table.HeaderCell>
          <Table.HeaderCell>Linje ID</Table.HeaderCell>
          <Table.HeaderCell>Attestert</Table.HeaderCell>
          <Table.HeaderCell>Dato vedtak FOM</Table.HeaderCell>
          <Table.HeaderCell>Dato vedtak TOM</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {treffliste.map((o) => (
          <Table.Row key={o.oppdragsId}>
            <Table.DataCell>{o.oppdragsId}</Table.DataCell>
            <Table.DataCell>{o.navnFaggruppe}</Table.DataCell>
            <Table.DataCell>{o.fagsystemId}</Table.DataCell>
            <Table.DataCell>{o.antAttestanter}</Table.DataCell>
            <Table.DataCell>{o.linjeId}</Table.DataCell>
            <Table.DataCell>{o.attestert}</Table.DataCell>
            <Table.DataCell>{o.datoVedtakFom}</Table.DataCell>
            <Table.DataCell>{o.datoVedtakTom}</Table.DataCell>
            <Table.DataCell>{o.kodeStatus}</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
