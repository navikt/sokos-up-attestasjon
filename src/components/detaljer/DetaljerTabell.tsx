import React, { useState } from "react";
import { Checkbox, Table, TextField } from "@navikt/ds-react";
import { OppdragsDetaljer } from "../../types/OppdragsDetaljer";
import styles from "./DetaljerTabell.module.css";

interface DetaljerTabellProps {
  oppdragsdetaljer: OppdragsDetaljer[];
}

type Linjetype = "fjern" | "attester";

export const DetaljerTabell = ({ oppdragsdetaljer }: DetaljerTabellProps) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  function toggleSelectedRow(id: number) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => id !== i) : [...prev, id],
    );
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
            <Table.HeaderCell scope="col">Klasse</Table.HeaderCell>
            <Table.HeaderCell scope="col" align="right">
              Delytelses Id
            </Table.HeaderCell>
            <Table.HeaderCell scope="col" align="right">
              Sats
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
            <Table.HeaderCell scope="col">Periode(r)</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kostnadssted</Table.HeaderCell>
            <Table.HeaderCell scope="col">Ansvarssted</Table.HeaderCell>
            <Table.HeaderCell scope="col">Attestant</Table.HeaderCell>
            <Table.HeaderCell scope="col">Ugyldig FOM</Table.HeaderCell>
            <Table.HeaderCell scope="col">Aksjon</Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Checkbox
                checked={checkedStatus("attester") === "alle"}
                indeterminate={checkedStatus("attester") === "noen"}
                onChange={() => handleToggleAll("attester")}
              >
                Velg alle attesterte
              </Checkbox>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Checkbox
                checked={checkedStatus("fjern") === "alle"}
                indeterminate={checkedStatus("fjern") === "noen"}
                onChange={() => handleToggleAll("fjern")}
              >
                Velg alle uattesterte
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
                      label={undefined}
                      value={"31.12.9999"}
                      disabled={!selectedRows.includes(linje.linjeId)}
                    />
                  </div>
                )}
              </Table.DataCell>
              <Table.DataCell>
                <Checkbox
                  checked={selectedRows.includes(linje.linjeId)}
                  onChange={() => toggleSelectedRow(linje.linjeId)}
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
