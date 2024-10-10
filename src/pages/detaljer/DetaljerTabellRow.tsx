import React, { ChangeEvent } from "react";
import { Checkbox, Table, TextField } from "@navikt/ds-react";
import {
  dagensDato,
  isDateInThePast,
  isInvalidDateFormat,
  isoDatoTilNorskDato,
} from "../../util/datoUtil";
import { StatefulLinje } from "./DetaljerTabell";
import styles from "./DetaljerTabellRow.module.css";

type DetaljerTabellRowProps = {
  linjeMedEndring: StatefulLinje;
  handleStateChange: (id: number, l: StatefulLinje) => void;
  index: number;
};

function DetaljerTabellRow({
  linjeMedEndring,
  index,
  handleStateChange,
}: DetaljerTabellRowProps) {
  function handleTextFieldChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    handleStateChange(index, {
      ...linjeMedEndring,
      activelyChangedDatoUgyldigFom: value,
      dateError: isInvalidDateFormat(value)
        ? "Ugyldig datoformat"
        : isDateInThePast(value)
          ? "Dato kan ikke være i fortid"
          : undefined,
    });
  }

  function toggleAttester(event: ChangeEvent<HTMLInputElement>) {
    handleStateChange(index, {
      ...linjeMedEndring,
      attester: event.target.checked,
      suggestedDatoUgyldigFom: event.target.checked ? "31.12.9999" : undefined,
    });
  }

  function toggleFjern(event: ChangeEvent<HTMLInputElement>) {
    handleStateChange(index, {
      ...linjeMedEndring,
      fjern: event.target.checked,
      suggestedDatoUgyldigFom: event.target.checked ? dagensDato() : undefined,
    });
  }

  function formatterNorsk(sats: number) {
    return new Intl.NumberFormat("no-NO", {
      style: "decimal",
      minimumFractionDigits: 2,
    }).format(sats);
  }

  const erAttestert = linjeMedEndring.linje.attestasjoner.length > 0;
  return (
    <Table.Row
      key={index}
      selected={erAttestert ? linjeMedEndring.fjern : linjeMedEndring.attester}
    >
      <Table.DataCell>
        {linjeMedEndring.vises &&
          linjeMedEndring.linje.oppdragsLinje.kodeKlasse}
      </Table.DataCell>
      <Table.DataCell align="center">
        {linjeMedEndring.vises &&
          linjeMedEndring.linje.oppdragsLinje.delytelseId}
      </Table.DataCell>
      <Table.DataCell align="center">
        {linjeMedEndring.vises &&
          formatterNorsk(linjeMedEndring.linje.oppdragsLinje.sats)}
      </Table.DataCell>
      <Table.DataCell>
        {linjeMedEndring.vises && linjeMedEndring.linje.oppdragsLinje.typeSats}
      </Table.DataCell>
      <Table.DataCell>
        {linjeMedEndring.vises &&
          `${isoDatoTilNorskDato(linjeMedEndring.linje.oppdragsLinje.datoVedtakFom)} - ${isoDatoTilNorskDato(linjeMedEndring.linje.oppdragsLinje.datoVedtakTom)}`}
      </Table.DataCell>
      <Table.DataCell>
        {erAttestert && linjeMedEndring.linje.attestasjoner[0]?.attestant}
      </Table.DataCell>
      <Table.DataCell>
        {erAttestert && (
          <div className={styles["ugyldig-textfield"]}>
            <TextField
              size="small"
              label="Ugyldig FOM"
              hideLabel
              value={
                linjeMedEndring.activelyChangedDatoUgyldigFom ||
                (linjeMedEndring.fjern &&
                  linjeMedEndring.suggestedDatoUgyldigFom) ||
                isoDatoTilNorskDato(
                  linjeMedEndring.linje.attestasjoner[0]?.datoUgyldigFom,
                )
              }
              onChange={handleTextFieldChange}
              error={linjeMedEndring.dateError}
              disabled={!linjeMedEndring.fjern}
            />
          </div>
        )}
      </Table.DataCell>
      <Table.DataCell>
        {erAttestert ? (
          <Checkbox checked={linjeMedEndring.fjern} onChange={toggleFjern}>
            Fjern
          </Checkbox>
        ) : (
          <Checkbox
            checked={linjeMedEndring.attester}
            onChange={toggleAttester}
          >
            Attester
          </Checkbox>
        )}
      </Table.DataCell>
      <Table.DataCell />
      <Table.DataCell />
      <Table.DataCell />
    </Table.Row>
  );
}

export default DetaljerTabellRow;
