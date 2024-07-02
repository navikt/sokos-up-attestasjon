import React from "react";
import { Table } from "@navikt/ds-react";
import { Attestasjonsdetaljer } from "../../models/Attestasjonsdetaljer";

interface DetaljerTabellProps {
  detaljerliste: Attestasjonsdetaljer[];
}

export const DetaljerTabell: React.FC<DetaljerTabellProps> = ({
  detaljerliste,
}) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Klasse</Table.HeaderCell>
          <Table.HeaderCell>Delytelses Id</Table.HeaderCell>
          <Table.HeaderCell>Sats</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Periode(r)</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {detaljerliste.map((detalj) => (
          <Table.Row key={detalj.fagsystemId}>
            <Table.DataCell>{detalj.klasse}</Table.DataCell>
            <Table.DataCell>{detalj.delytelsesId}</Table.DataCell>
            <Table.DataCell>{detalj.sats}</Table.DataCell>
            <Table.DataCell>{detalj.satstype}</Table.DataCell>
            <Table.DataCell>
              {detalj.datoVedtakFom} - {detalj.datoVedtakTom}
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
