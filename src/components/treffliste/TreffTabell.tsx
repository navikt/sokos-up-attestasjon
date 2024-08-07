import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Table } from "@navikt/ds-react";
import { Oppdrag } from "../../types/Oppdrag";
import styles from "./TreffTabell.module.css";

interface TreffTabellProps {
  treffliste: Oppdrag[];
}

export const TreffTabell: React.FC<TreffTabellProps> = ({ treffliste }) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleSelectedRow = (value: string) =>
    setSelectedRows((list) =>
      list.includes(value)
        ? list.filter((id) => id !== value)
        : [...list, value],
    );

  const handleSubmit = async () => {
    navigate("/detaljer", {
      state: { oppdragsIder: selectedRows.map((id) => parseInt(id)) },
    });
  };

  return (
    <>
      <div className={styles.trefftabell__knapperad}>
        <Button
          variant="secondary"
          disabled={selectedRows.length < 1}
          size="small"
          onClick={handleSubmit}
        >
          Vis detaljer
        </Button>
      </div>
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
                  if (selectedRows.length) {
                    setSelectedRows([]);
                  } else {
                    setSelectedRows(
                      treffliste.map(({ oppdragsId }) => oppdragsId.toString()),
                    );
                  }
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
              <Table.DataCell>
                <Checkbox
                  hideLabel
                  checked={selectedRows.includes(oppdrag.oppdragsId.toString())}
                  onChange={() =>
                    toggleSelectedRow(oppdrag.oppdragsId.toString())
                  }
                >
                  {" "}
                </Checkbox>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
