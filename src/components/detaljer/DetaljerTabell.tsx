import React, { ChangeEvent, useState } from "react";
import { Checkbox, Table, TextField } from "@navikt/ds-react";
import { OppdragsDetaljer } from "../../types/OppdragsDetaljer";
import styles from "./DetaljerTabell.module.css";

interface DetaljerTabellProps {
  oppdragsdetaljer: OppdragsDetaljer[];
}

type Linjetype = "fjern" | "attester";

type LinjeEndring = {
  checked: boolean;
  activelyChangedDatoUgyldigFom?: string;
  suggestedDatoUgyldigFom?: string;
};

export const DetaljerTabell = ({ oppdragsdetaljer }: DetaljerTabellProps) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [changes, setChanges] = useState<{ [linjeId: number]: LinjeEndring }>(
    {},
  );

  function toggleSelectedRow(
    event: ChangeEvent<HTMLInputElement>,
    linje: OppdragsDetaljer,
  ) {
    const id = linje.linjeId;
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => id !== i) : [...prev, id],
    );
    setChanges((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        suggestedDatoUgyldigFom: event.target.checked
          ? new Date().toISOString().split("T")[0]
          : undefined,
      },
    }));
  }

  function handleTextFieldChange(id: number, value: string) {
    setChanges((previousChanges) => ({
      ...previousChanges,
      [id]: { ...previousChanges[id], activelyChangedDatoUgyldigFom: value },
    }));
  }

  function lines(type: Linjetype) {
    return type === "attester"
      ? oppdragsdetaljer.filter((linje) => !linje.attestant)
      : /* type === "fjern"   */ oppdragsdetaljer.filter(
          (linje) => linje.attestant,
        );
  }

  function ids(type: Linjetype) {
    return lines(type).map((l) => l.linjeId);
  }

  function checkedStatus(type: Linjetype) {
    const alle: boolean = !lines(type).some(
      (linje) => !selectedRows.includes(linje.linjeId),
    );
    const noen: boolean = lines(type).some((linje) =>
      selectedRows.includes(linje.linjeId),
    );

    if (alle) return "alle";
    else if (noen) return "noen";
    else return "ingen";
  }

  function handleToggleAll(type: Linjetype) {
    // alle var huket av fra før
    if (checkedStatus(type) === "alle") {
      setSelectedRows(selectedRows.filter((id) => !ids(type).includes(id)));
    }
    // ingen var huket av fra før
    // noen var huket av fra før
    else setSelectedRows((prev) => [...prev, ...ids(type)]);
  }

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Klassekode</Table.HeaderCell>
            <Table.HeaderCell scope="col" align="right">
              Delytelse
            </Table.HeaderCell>
            <Table.HeaderCell scope="col" align="right">
              Sats
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">Satstype</Table.HeaderCell>
            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kostnadssted</Table.HeaderCell>
            <Table.HeaderCell scope="col">Ansvarssted</Table.HeaderCell>
            <Table.HeaderCell scope="col">Attestant</Table.HeaderCell>
            <Table.HeaderCell scope="col">Ugyldig f.o.m</Table.HeaderCell>
            <Table.HeaderCell scope="col">Aksjon</Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Checkbox
                checked={
                  lines("attester").length > 0 &&
                  checkedStatus("attester") === "alle"
                }
                indeterminate={checkedStatus("attester") === "noen"}
                onChange={() => handleToggleAll("attester")}
                disabled={lines("attester").length === 0}
              >
                Attester alle
              </Checkbox>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Checkbox
                checked={
                  lines("fjern").length > 0 && checkedStatus("fjern") === "alle"
                }
                indeterminate={checkedStatus("fjern") === "noen"}
                onChange={() => handleToggleAll("fjern")}
                disabled={lines("fjern").length === 0}
              >
                Avattester alle
              </Checkbox>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {oppdragsdetaljer.map((linje) => (
            <Table.Row
              key={linje.linjeId}
              selected={selectedRows.includes(linje.linjeId)}
            >
              <Table.DataCell>{linje.kodeKlasse}</Table.DataCell>
              <Table.DataCell align="center">{linje.linjeId}</Table.DataCell>
              <Table.DataCell align="center">{linje.sats}</Table.DataCell>
              <Table.DataCell>{linje.satstype}</Table.DataCell>
              <Table.DataCell>
                {linje.datoVedtakFom} - {linje.datoVedtakTom}
              </Table.DataCell>
              <Table.DataCell>
                {linje.kostnadsStedForOppdragsLinje}
              </Table.DataCell>
              <Table.DataCell>
                {linje.ansvarsStedForOppdragsLinje}
              </Table.DataCell>
              <Table.DataCell>{linje.attestant}</Table.DataCell>
              <Table.DataCell>
                {linje.attestant && (
                  <div className={styles.ugyldig_textfield}>
                    <TextField
                      size="small"
                      label="Ugyldig FOM"
                      hideLabel
                      value={
                        changes[linje.linjeId]?.activelyChangedDatoUgyldigFom ||
                        (selectedRows.includes(linje.linjeId) &&
                          changes[linje.linjeId]?.suggestedDatoUgyldigFom) ||
                        linje.datoUgyldigFom
                      }
                      onChange={(e) =>
                        handleTextFieldChange(linje.linjeId, e.target.value)
                      }
                      disabled={!selectedRows.includes(linje.linjeId)}
                    />
                  </div>
                )}
              </Table.DataCell>
              <Table.DataCell>
                <Checkbox
                  checked={selectedRows.includes(linje.linjeId)}
                  onChange={(e) => toggleSelectedRow(e, linje)}
                >
                  {linje.attestant ? "Fjern" : "Attester"}
                </Checkbox>
              </Table.DataCell>
              <Table.DataCell />
              <Table.DataCell />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
