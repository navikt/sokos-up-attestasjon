import React, { useState } from "react";
import { Checkbox, Table, TextField } from "@navikt/ds-react";
import { OppdragsDetaljer } from "../../types/OppdragsDetaljer";
import styles from "./DetaljerTabell.module.css";

interface DetaljerTabellProps {
  key: number;
  detaljerliste: OppdragsDetaljer[];
  fagsystemId: string;
}

export const DetaljerTabell: React.FC<DetaljerTabellProps> = ({
  detaljerliste,
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [enabledTextFields, setEnabledTextFields] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleSelectedRow = (value: string) =>
    setSelectedRows((list) =>
      list.includes(value)
        ? list.filter((id) => id !== value)
        : [...list, value],
    );

  const handleCheckboxChange = (delytelsesId: string) => {
    toggleSelectedRow(delytelsesId);
    setEnabledTextFields((prev) => ({
      ...prev,
      [delytelsesId]: !prev[delytelsesId],
    }));
  };

  const handleSelectAll = () => {
    const allSelected = selectedRows.length === detaljerliste.length;
    const newSelectedRows = allSelected
      ? []
      : detaljerliste.map((detalj) => detalj.delytelsesId);
    setSelectedRows(newSelectedRows);
    const newEnabledTextFields = allSelected
      ? {}
      : Object.fromEntries(
          detaljerliste.map((detalj) => [detalj.delytelsesId, true]),
        );
    setEnabledTextFields(newEnabledTextFields);
  };

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
            <Table.HeaderCell>
              <Checkbox
                checked={selectedRows.length === detaljerliste.length}
                indeterminate={
                  selectedRows.length > 0 &&
                  selectedRows.length !== detaljerliste.length
                }
                onChange={handleSelectAll}
              >
                Velg alle
              </Checkbox>
            </Table.HeaderCell>
            <Table.HeaderCell>Ugyldig FOM</Table.HeaderCell>
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
                {detalj.attestant ? (
                  <>
                    <div className={styles.checkbox_container}>
                      <Checkbox
                        checked={selectedRows.includes(detalj.delytelsesId)}
                        onChange={() =>
                          handleCheckboxChange(detalj.delytelsesId)
                        }
                      >
                        Fjern
                      </Checkbox>
                      <div className={styles.ugyldig_textfield}>
                        <TextField
                          size="small"
                          label={undefined}
                          value={"31.12.9999"}
                          disabled={!enabledTextFields[detalj.delytelsesId]}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.checkbox_container}>
                      <Checkbox
                        checked={selectedRows.includes(detalj.delytelsesId)}
                        onChange={() =>
                          handleCheckboxChange(detalj.delytelsesId)
                        }
                      >
                        Attester
                      </Checkbox>
                      <Checkbox
                        checked={selectedRows.includes(detalj.delytelsesId)}
                        onChange={() =>
                          handleCheckboxChange(detalj.delytelsesId)
                        }
                      >
                        Utbetales nå
                      </Checkbox>
                    </div>
                  </>
                )}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
