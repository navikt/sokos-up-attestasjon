import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox, Table } from "@navikt/ds-react";
import { AttestasjonTreff } from "../../models/AttestasjonTreff";

interface TreffTabellProps {
  treffliste: AttestasjonTreff[];
}

export const TreffTabell: React.FC<TreffTabellProps> = ({ treffliste }) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleSelectedRow = (value: string) =>
    setSelectedRows((list) =>
      list.includes(value)
        ? list.filter((id) => id !== value)
        : [...list, value],
    );

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Gjelder ID</Table.HeaderCell>
          <Table.HeaderCell>Faggruppe</Table.HeaderCell>
          <Table.HeaderCell>Fagsystem ID</Table.HeaderCell>
          <Table.HeaderCell>Fagområde</Table.HeaderCell>
          <Table.DataCell>
            <Checkbox
              checked={selectedRows.length === treffliste.length}
              indeterminate={
                selectedRows.length > 0 &&
                selectedRows.length !== treffliste.length
              }
              onChange={() => {
                selectedRows.length
                  ? setSelectedRows([])
                  : setSelectedRows(
                      treffliste.map(({ oppdragsId }) => oppdragsId.toString()),
                    );
              }}
              hideLabel
            >
              Velg alle rader
            </Checkbox>
          </Table.DataCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {treffliste.map((oppdrag) => (
          <Table.Row
            key={oppdrag.oppdragsId}
            selected={selectedRows.includes(oppdrag.oppdragsId.toString())}
          >
            <Table.DataCell>
              <Link to={`/oppdragslinjer/${oppdrag.oppdragsId}`}>
                {oppdrag.gjelderId}
              </Link>
            </Table.DataCell>
            <Table.DataCell>{oppdrag.navnFaggruppe}</Table.DataCell>
            <Table.DataCell>{oppdrag.fagsystemId}</Table.DataCell>
            <Table.DataCell>{oppdrag.navnFagomraade}</Table.DataCell>
            <Table.DataCell>
              <Checkbox
                hideLabel
                checked={selectedRows.includes(oppdrag.oppdragsId.toString())}
                onChange={() =>
                  toggleSelectedRow(oppdrag.oppdragsId.toString())
                }
                aria-labelledby={`id-${oppdrag.oppdragsId}`}
              >
                {" "}
              </Checkbox>
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
