import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Checkbox, Loader, Table, TextField } from "@navikt/ds-react";
import { Attestasjonlinje } from "../../types/Attestasjonlinje";
import { OppdragsDetaljer } from "../../types/OppdragsDetaljer";
import { formatterNorsk } from "../../util/commonUtils";
import {
  dagensDato,
  isDateInThePast,
  isInvalidDateFormat,
  isoDatoTilNorskDato,
} from "../../util/datoUtil";
import styles from "./DetaljerTabell.module.css";
import { tranformToAttestasjonlinje } from "./detaljerUtils";

type DetaljerTabellProps = {
  antallAttestanter: number;
  oppdragsDetaljer: OppdragsDetaljer;
  handleSubmit: (linjer: Attestasjonlinje[]) => void;
  isLoading: boolean;
  setAlertError: (value: React.SetStateAction<string | null>) => void;
};

type Linjetype = "fjern" | "attester";

export default function DetaljerTabell(props: DetaljerTabellProps) {
  const [attestasjonlinjer, setAttestasjonlinjer] = useState<
    Attestasjonlinje[]
  >([]);
  const [velgAntallAttestasjoner, setVelgAntallAttestasjoner] =
    useState<number>(0);
  const [fjernAntallAttestasjoner, setFjernAntallAttestasjoner] =
    useState<number>(0);

  useEffect(() => {
    if (props.oppdragsDetaljer) {
      const linjer = tranformToAttestasjonlinje(
        props.oppdragsDetaljer,
        props.antallAttestanter,
      );
      setAttestasjonlinjer(linjer);
      setVelgAntallAttestasjoner(
        linjer.filter((linje) => !linje.attestant).length,
      );
      setFjernAntallAttestasjoner(
        linjer.filter((linje) => linje.attestant).length,
      );
    }
  }, [props.oppdragsDetaljer, props.antallAttestanter]);

  function handleStateChange(index: number, newState: Attestasjonlinje) {
    const newLinjer = attestasjonlinjer.map((linje, i) =>
      i === index ? newState : linje,
    );
    const hasDateError = newLinjer.some((linje) => linje.properties.dateError);
    const hasSelectedLine = newLinjer.some(
      (linje) => linje.properties.attester || linje.properties.fjern,
    );

    props.setAlertError((oldAlert) => {
      if (
        oldAlert === "Du må rette feil i datoformat før du kan oppdatere" &&
        !hasDateError
      )
        return null;
      if (
        oldAlert === "Du må velge minst en linje før du kan oppdatere" &&
        hasSelectedLine
      )
        return null;
      return oldAlert;
    });

    setAttestasjonlinjer(newLinjer);
  }

  function handleTextFieldChange(
    event: ChangeEvent<HTMLInputElement>,
    index: number,
    linje: Attestasjonlinje,
  ) {
    const value = event.target.value;
    handleStateChange(index, {
      ...linje,
      properties: {
        ...linje.properties,
        activelyChangedDatoUgyldigFom: value,
        dateError: isInvalidDateFormat(value)
          ? "Ugyldig datoformat"
          : isDateInThePast(value)
            ? "Dato kan ikke være i fortid"
            : undefined,
      },
    });
  }

  function toggleCheckbox(
    event: ChangeEvent<HTMLInputElement>,
    index: number,
    linje: Attestasjonlinje,
    type: Linjetype,
  ) {
    handleStateChange(index, {
      ...linje,
      properties: {
        ...linje.properties,
        [type]: event.target.checked,
        suggestedDatoUgyldigFom: event.target.checked
          ? type === "fjern"
            ? dagensDato()
            : "31.12.9999"
          : undefined,
      },
    });
  }

  function handleToggleAll(type: Linjetype) {
    const isAllChecked = getCheckedStatus(type) === "alle";
    setAttestasjonlinjer((prev) =>
      prev.map((linje) => ({
        ...linje,
        properties: {
          ...linje.properties,
          [type]: !isAllChecked,
          suggestedDatoUgyldigFom: !isAllChecked
            ? type === "fjern"
              ? dagensDato()
              : "31.12.9999"
            : undefined,
        },
      })),
    );
  }

  function getCheckedStatus(type: Linjetype) {
    const filteredLinjer = attestasjonlinjer.filter((linje) =>
      type === "attester" ? !linje.attestant : linje.attestant,
    );
    const numberOfChecked = filteredLinjer.filter(
      (linje) => linje.properties[type],
    ).length;
    if (numberOfChecked === filteredLinjer.length) return "alle";
    if (numberOfChecked > 0) return "noen";
    return "ingen";
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
            <Table.HeaderCell scope="col">Attestant</Table.HeaderCell>
            <Table.HeaderCell scope="col">Ugyldig f.o.m</Table.HeaderCell>
            <Table.HeaderCell scope="col">Aksjon</Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Checkbox
                checked={
                  velgAntallAttestasjoner > 0 &&
                  getCheckedStatus("attester") === "alle"
                }
                indeterminate={getCheckedStatus("attester") === "noen"}
                onChange={() => handleToggleAll("attester")}
                disabled={velgAntallAttestasjoner === 0}
              >
                Attester alle
              </Checkbox>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Checkbox
                checked={
                  fjernAntallAttestasjoner > 0 &&
                  getCheckedStatus("fjern") === "alle"
                }
                indeterminate={getCheckedStatus("fjern") === "noen"}
                onChange={() => handleToggleAll("fjern")}
                disabled={fjernAntallAttestasjoner === 0}
              >
                Avattester alle
              </Checkbox>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Button
                type={"submit"}
                size={"medium"}
                onClick={() => props.handleSubmit(attestasjonlinjer)}
                disabled={props.isLoading}
              >
                {props.isLoading ? <Loader size={"small"} /> : "Oppdater"}
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {attestasjonlinjer.map((linje, index) => (
            <Table.Row
              key={index}
              selected={
                linje.attestant
                  ? linje.properties.fjern
                  : linje.properties.attester
              }
            >
              <Table.DataCell>
                {linje.properties.vises && linje.kodeKlasse}
              </Table.DataCell>
              <Table.DataCell align="center">
                {linje.properties.vises && linje.delytelseId}
              </Table.DataCell>
              <Table.DataCell align="center">
                {linje.properties.vises && formatterNorsk(linje.sats)}
              </Table.DataCell>
              <Table.DataCell>
                {linje.properties.vises && linje.typeSats}
              </Table.DataCell>
              <Table.DataCell>
                {linje.properties.vises &&
                  `${isoDatoTilNorskDato(linje.datoVedtakFom)} - ${isoDatoTilNorskDato(linje.datoVedtakTom)}`}
              </Table.DataCell>
              <Table.DataCell>{linje.attestant}</Table.DataCell>
              <Table.DataCell>
                {linje.attestant && (
                  <div className={styles["ugyldig-textfield"]}>
                    <TextField
                      size="small"
                      label="Ugyldig FOM"
                      hideLabel
                      value={
                        linje.properties.activelyChangedDatoUgyldigFom ||
                        (linje.properties.fjern &&
                          linje.properties.suggestedDatoUgyldigFom) ||
                        isoDatoTilNorskDato(linje.datoUgyldigFom)
                      }
                      onChange={(e) => handleTextFieldChange(e, index, linje)}
                      error={linje.properties.dateError}
                      disabled={!linje.properties.fjern}
                    />
                  </div>
                )}
              </Table.DataCell>
              <Table.DataCell>
                <Checkbox
                  checked={
                    linje.attestant
                      ? linje.properties.fjern
                      : linje.properties.attester
                  }
                  onChange={(e) =>
                    toggleCheckbox(
                      e,
                      index,
                      linje,
                      linje.attestant ? "fjern" : "attester",
                    )
                  }
                >
                  {linje.attestant ? "Fjern" : "Attester"}
                </Checkbox>
              </Table.DataCell>
              <Table.DataCell />
              <Table.DataCell />
              <Table.DataCell />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
