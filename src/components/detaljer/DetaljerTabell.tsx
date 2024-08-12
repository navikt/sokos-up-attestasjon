import React, { useState } from "react";
import { Checkbox, Table } from "@navikt/ds-react";
import { OppdragsDetaljer } from "../../types/OppdragsDetaljer";

interface DetaljerTabellProps {
  key: number;
  detaljerliste: OppdragsDetaljer[];
  fagsystemId: string;
}

export const DetaljerTabell: React.FC<DetaljerTabellProps> = ({
  detaljerliste,
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleSelectedRow = (value: string) =>
    setSelectedRows((list) =>
      list.includes(value)
        ? list.filter((id) => id !== value)
        : [...list, value],
    );

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Klasse</Table.HeaderCell>
            <Table.HeaderCell>Delytelses Id</Table.HeaderCell>
            <Table.HeaderCell>Sats</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Periode(r)</Table.HeaderCell>
            <Table.HeaderCell>Attestant</Table.HeaderCell>
            <Table.DataCell>
              <Checkbox
                checked={selectedRows.length === detaljerliste.length}
                indeterminate={
                  selectedRows.length > 0 &&
                  selectedRows.length !== detaljerliste.length
                }
                onChange={() => {
                  if (selectedRows.length > 0) {
                    setSelectedRows([]);
                  } else {
                    setSelectedRows(
                      detaljerliste.map(({ delytelsesId }) => delytelsesId),
                    );
                  }
                }}
              >
                Velg alle
              </Checkbox>
            </Table.DataCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {detaljerliste.map((detalj) => (
            <Table.Row
              key={detalj.delytelsesId}
              selected={selectedRows.includes(detalj.delytelsesId)}
            >
              <Table.DataCell>{detalj.klasse}</Table.DataCell>
              <Table.DataCell>{detalj.delytelsesId}</Table.DataCell>
              <Table.DataCell>{detalj.sats}</Table.DataCell>
              <Table.DataCell>{detalj.satstype}</Table.DataCell>
              <Table.DataCell>
                {detalj.datoVedtakFom} - {detalj.datoVedtakTom}
              </Table.DataCell>
              <Table.DataCell>{detalj.attestant}</Table.DataCell>
              <Table.DataCell>
                <Checkbox
                  checked={selectedRows.includes(detalj.delytelsesId)}
                  onChange={() => toggleSelectedRow(detalj.delytelsesId)}
                >
                  {detalj.attestant ? "Fjern" : "Attester"}
                </Checkbox>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
