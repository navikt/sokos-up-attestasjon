import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Checkbox, Loader, Table, TextField } from "@navikt/ds-react";
import { Attestasjonlinje } from "../../types/Attestasjonlinje";
import { OppdragsDetaljer, OppdragsLinje } from "../../types/OppdragsDetaljer";
import { formatterNorsk } from "../../util/commonUtils";
import {
  dagensDato,
  isDateInThePast,
  isInvalidDateFormat,
  isoDatoTilNorskDato,
} from "../../util/datoUtil";
import styles from "./DetaljerTabell.module.css";
import {
  splittOgLeggTilEkstraLinjeForManuellePosteringerTemp,
  tranformToAttestasjonlinje,
} from "./detaljerUtils";

type DetaljerTabellProps = {
  antallAttestanter: number;
  oppdragsDetaljer: OppdragsDetaljer;
  handleSubmit: (linjer: Attestasjonlinje[]) => void;
  isLoading: boolean;
  setAlertError: (value: React.SetStateAction<string | null>) => void;
};

type Linjetype = "fjern" | "attester";

export type StatefulLinje = {
  activelyChangedDatoUgyldigFom?: string;
  attester: boolean;
  linje: OppdragsLinje;
  dateError?: string;
  fjern: boolean;
  suggestedDatoUgyldigFom?: string;
  vises: boolean;
};

export default function DetaljerTabell(props: DetaljerTabellProps) {
  const [linjerMedEndringer, setLinjerMedEndringer] = useState(
    props.oppdragsDetaljer.linjer
      .map((o) =>
        splittOgLeggTilEkstraLinjeForManuellePosteringerTemp(
          o,
          props.antallAttestanter,
          props.oppdragsDetaljer.saksbehandlerIdent,
        ),
      )
      .flatMap(setOnlyFirstVisible),
  );

  const [attestasjonlinjer, setAttestasjonlinjer] = useState<
    Attestasjonlinje[]
  >([]);

  useEffect(() => {
    if (props.oppdragsDetaljer) {
      setAttestasjonlinjer(
        tranformToAttestasjonlinje(
          props.oppdragsDetaljer,
          props.antallAttestanter,
        ),
      );
    }
  }, [props.oppdragsDetaljer, props.antallAttestanter]);

  function handleTextFieldChange(
    event: ChangeEvent<HTMLInputElement>,
    index: number,
    attestasjonlinje: Attestasjonlinje,
  ): void {
    const value = event.target.value;
    handleStateChange(index, {
      ...attestasjonlinje,
      properties: {
        ...attestasjonlinje.properties,
        activelyChangedDatoUgyldigFom: value,
        dateError: isInvalidDateFormat(value)
          ? "Ugyldig datoformat"
          : isDateInThePast(value)
            ? "Dato kan ikke være i fortid"
            : undefined,
      },
    });
  }

  function toggleAttester(
    event: ChangeEvent<HTMLInputElement>,
    index: number,
    attestasjonlinje: Attestasjonlinje,
  ) {
    handleStateChange(index, {
      ...attestasjonlinje,
      properties: {
        ...attestasjonlinje.properties,
        attester: event.target.checked,
        suggestedDatoUgyldigFom: event.target.checked
          ? "31.12.9999"
          : undefined,
      },
    });
  }

  function toggleFjern(
    event: ChangeEvent<HTMLInputElement>,
    index: number,
    attestasjonlinje: Attestasjonlinje,
  ) {
    handleStateChange(index, {
      ...attestasjonlinje,
      properties: {
        ...attestasjonlinje.properties,
        fjern: event.target.checked,
        suggestedDatoUgyldigFom: event.target.checked
          ? dagensDato()
          : undefined,
      },
    });
  }

  function setOnlyFirstVisible(linjer: OppdragsLinje[]): StatefulLinje[] {
    return linjer.map((l, index) => ({
      activelyChangedDatoUgyldigFom: "",
      attester: false,
      dateError: "",
      linje: l,
      fjern: false,
      suggestedDatoUgyldigFom: "",
      vises: index == 0,
    }));
  }

  const handleStateChange = (index: number, newState: Attestasjonlinje) => {
    const newLinjer = attestasjonlinjer.map((component, i) =>
      i === index ? newState : component,
    );
    if (
      !newLinjer.some(
        (attestasjonlinje) => attestasjonlinje.properties.dateError,
      )
    )
      props.setAlertError((oldAlert) =>
        !!oldAlert &&
        oldAlert == "Du må rette feil i datoformat før du kan oppdatere"
          ? null
          : oldAlert,
      );
    if (
      newLinjer.some(
        (attestasjonlinje) =>
          attestasjonlinje.properties.attester ||
          attestasjonlinje.properties.fjern,
      )
    )
      props.setAlertError((oldAlert) =>
        !!oldAlert &&
        oldAlert == "Du må velge minst en linje før du kan oppdatere"
          ? null
          : oldAlert,
      );
    setAttestasjonlinjer(newLinjer);
  };

  function getLinjetype(linjetype: Linjetype) {
    return linjetype === "attester"
      ? linjerMedEndringer.filter(
          (linje) => linje.linje.attestasjoner.length == 0,
        )
      : /* type === "fjern"   */ linjerMedEndringer.filter(
          (linje) => linje.linje.attestasjoner.length > 0,
        );
  }

  function checkedStatus(type: Linjetype) {
    const numberOfChecked = linjerMedEndringer.filter((l) =>
      type == "fjern"
        ? l.fjern && l.linje.attestasjoner.length > 0
        : l.attester && l.linje.attestasjoner.length == 0,
    ).length;

    if (numberOfChecked == getLinjetype(type).length) return "alle";
    else if (numberOfChecked > 0) return "noen";
    else return "ingen";
  }

  function handleToggleAll(type: Linjetype) {
    if (checkedStatus(type) === "alle") {
      // alle var huket av fra før
      setLinjerMedEndringer((prev) =>
        prev.map((l) => ({
          ...l,
          attester:
            type === "attester" ? l.linje.attestasjoner.length > 0 : l.attester,
          fjern: type === "fjern" ? l.linje.attestasjoner.length == 0 : l.fjern,
        })),
      );
    } else {
      // ingen var huket av fra før - knappen er tom firkant
      // noen var huket av fra før - knappen er et minustegn
      setLinjerMedEndringer((prev) =>
        prev.map((l) => ({
          ...l,
          attester:
            type === "attester"
              ? l.linje.attestasjoner.length == 0
              : l.attester,
          fjern: type === "fjern" ? l.linje.attestasjoner.length > 0 : l.fjern,
          suggestedDatoUgyldigFom: l.linje.oppdragsLinje.attestert
            ? dagensDato()
            : "31.12.9999",
        })),
      );
    }
  }

  // useEffect(() => {
  //   setLinjerMedEndringer(
  //     props.oppdragsDetaljer.linjer
  //       .map((oppdrag) =>
  //         splittOgLeggTilEkstraLinjeForManuellePosteringerTemp(
  //           oppdrag,
  //           props.antallAttestanter,
  //           props.oppdragsDetaljer.saksbehandlerIdent ?? "x",
  //         ),
  //       )
  //       .flatMap(setOnlyFirstVisible),
  //   );
  // }, [
  //   props.oppdragsDetaljer,
  //   props.antallAttestanter,
  //   props.oppdragsDetaljer.saksbehandlerIdent,
  // ]);

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
                  getLinjetype("attester").length > 0 &&
                  checkedStatus("attester") === "alle"
                }
                indeterminate={checkedStatus("attester") === "noen"}
                onChange={() => handleToggleAll("attester")}
                disabled={getLinjetype("attester").length === 0}
              >
                Attester alle
              </Checkbox>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Checkbox
                checked={
                  getLinjetype("fjern").length > 0 &&
                  checkedStatus("fjern") === "alle"
                }
                indeterminate={checkedStatus("fjern") === "noen"}
                onChange={() => handleToggleAll("fjern")}
                disabled={getLinjetype("fjern").length === 0}
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
          {attestasjonlinjer.map((attestasjonlinje, index) => (
            <Table.Row
              key={index}
              selected={
                attestasjonlinje.attestant
                  ? attestasjonlinje.properties.fjern
                  : attestasjonlinje.properties.attester
              }
            >
              <Table.DataCell>
                {attestasjonlinje.properties.vises &&
                  attestasjonlinje.kodeKlasse}
              </Table.DataCell>
              <Table.DataCell align="center">
                {attestasjonlinje.properties.vises &&
                  attestasjonlinje.delytelseId}
              </Table.DataCell>
              <Table.DataCell align="center">
                {attestasjonlinje.properties.vises &&
                  formatterNorsk(attestasjonlinje.sats)}
              </Table.DataCell>
              <Table.DataCell>
                {attestasjonlinje.properties.vises && attestasjonlinje.typeSats}
              </Table.DataCell>
              <Table.DataCell>
                {attestasjonlinje.properties.vises &&
                  `${isoDatoTilNorskDato(attestasjonlinje.datoVedtakFom)} - ${isoDatoTilNorskDato(attestasjonlinje.datoVedtakTom)}`}
              </Table.DataCell>
              <Table.DataCell>{attestasjonlinje.attestant}</Table.DataCell>
              <Table.DataCell>
                {attestasjonlinje.attestant && (
                  <div className={styles["ugyldig-textfield"]}>
                    <TextField
                      size="small"
                      label="Ugyldig FOM"
                      hideLabel
                      value={
                        attestasjonlinje.properties
                          .activelyChangedDatoUgyldigFom ||
                        (attestasjonlinje.properties.fjern &&
                          attestasjonlinje.properties
                            .suggestedDatoUgyldigFom) ||
                        isoDatoTilNorskDato(attestasjonlinje.datoUgyldigFom)
                      }
                      onChange={(e) =>
                        handleTextFieldChange(e, index, attestasjonlinje)
                      }
                      error={attestasjonlinje.properties.dateError}
                      disabled={!attestasjonlinje.properties.fjern}
                    />
                  </div>
                )}
              </Table.DataCell>
              <Table.DataCell>
                {attestasjonlinje.attestant ? (
                  <Checkbox
                    checked={attestasjonlinje.properties.fjern}
                    onChange={(e) => toggleFjern(e, index, attestasjonlinje)}
                  >
                    Fjern
                  </Checkbox>
                ) : (
                  <Checkbox
                    checked={attestasjonlinje.properties.attester}
                    onChange={(e) => toggleAttester(e, index, attestasjonlinje)}
                  >
                    Attester
                  </Checkbox>
                )}
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
