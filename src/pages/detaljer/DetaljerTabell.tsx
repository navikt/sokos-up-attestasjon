import { ChangeEvent, useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { Button, Checkbox, Table, TextField, Tooltip } from "@navikt/ds-react";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import {
  Attestasjonlinje,
  AttestasjonlinjeList,
} from "../../types/Attestasjonlinje";
import { OppdragsDetaljerDTO } from "../../types/OppdragsDetaljerDTO";
import { AttestertStatus } from "../../types/schema/AttestertStatus";
import { DETALJER, logUserEvent } from "../../umami/umami";
import { formaterTilNorskTall } from "../../util/commonUtils";
import {
  dagensDato,
  isDateInThePast,
  isInvalidDateFormat,
  isoDatoTilNorskDato,
} from "../../util/datoUtil";
import styles from "./DetaljerTabell.module.css";
import RowWrapper from "./RowWrapper";
import SumModal from "./SumModal";
import { tranformToAttestasjonlinje } from "./detaljerUtils";

type DetaljerTabellProps = {
  antallAttestanter: number;
  oppdragsDetaljer: OppdragsDetaljerDTO;
  handleSubmit: (linjer: AttestasjonlinjeList) => void;
  isLoading: boolean;
  disable: boolean;
};

type Linjetype = "fjern" | "attester";

export default function DetaljerTabell(props: DetaljerTabellProps) {
  const [attestasjonlinjer, setAttestasjonlinjer] =
    useState<AttestasjonlinjeList>([]);
  const [velgAntallAttestasjoner, setVelgAntallAttestasjoner] =
    useState<number>(0);
  const [fjernAntallAttestasjoner, setFjernAntallAttestasjoner] =
    useState<number>(0);
  const [toggleAllRows, setToggleAllRows] = useState<boolean>(false);
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({});
  const { sokeData } = useStore.getState();

  function handleToggleAllRows() {
    const newToggleAll = !toggleAllRows;
    setToggleAllRows(newToggleAll);
    const newOpenRows = attestasjonlinjer.reduce(
      (acc, _, index) => {
        acc[index] = newToggleAll;
        return acc;
      },
      {} as Record<number, boolean>,
    );
    setOpenRows(newOpenRows);
  }

  function handleRowToggle(index: number, open: boolean) {
    setOpenRows((prev) => {
      const newOpenRows = { ...prev, [index]: open };
      const allOpen = Object.values(newOpenRows).every((isOpen) => isOpen);
      setToggleAllRows(allOpen);
      return newOpenRows;
    });
  }

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
    logUserEvent(DETALJER.VELG_ALLE, { type });
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

  function calculateSum(type: "attesteres" | "tidligere") {
    const filteredLinjer =
      type == "attesteres"
        ? attestasjonlinjer
            .filter((linje) => !linje.attestant)
            .filter((linje) => linje.properties["attester"])
        : attestasjonlinjer
            .filter((linje) => linje.attestert)
            .filter((linje) => linje.properties.vises);

    const sumPerKlassekode = filteredLinjer.reduce(
      (acc, linje) => {
        const { kodeKlasse, sats } = linje;
        if (!acc[kodeKlasse]) {
          acc[kodeKlasse] = 0;
        }
        acc[kodeKlasse] += sats;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalsum = filteredLinjer.reduce((sum, linje) => sum + linje.sats, 0);

    return { sumPerKlassekode, totalsum };
  }

  return (
    <div className={commonstyles["table-container"]}>
      <div className={styles["button-row"]}>
        <div className={styles["button-row__left"]}>
          {sokeData?.alternativer !== AttestertStatus.ATTESTERT && (
            <SumModal
              tittel={"Sum per klassekode som attesteres"}
              sum={calculateSum("attesteres")}
            />
          )}
          {sokeData?.alternativer !==
            AttestertStatus.IKKE_FERDIG_ATTESTERT_EKSL_EGNE &&
            sokeData?.alternativer !==
              AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE && (
              <SumModal
                tittel={"Sum per klassekode tidligere attestert"}
                sum={calculateSum("tidligere")}
              />
            )}
        </div>

        <div className={styles["button-row__center"]}>
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
        </div>

        <div className={styles["button-row__right"]}>
          <Button
            type={"submit"}
            disabled={props.disable}
            data-umami-event={DETALJER.OPPDATER_TRYKKET}
            data-umami-event-attester={getCheckedStatus("attester")}
            data-umami-event-fjern={getCheckedStatus("fjern")}
            size={"small"}
            loading={props.isLoading}
            onClick={() => props.handleSubmit(attestasjonlinjer)}
          >
            Oppdater
          </Button>
        </div>
      </div>
      <div className={commonstyles["table"]}>
        <Table id={"detaljertabell"}>
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
                <div className={styles["toggle"]}>
                  <Button
                    size={"small"}
                    disabled={props.disable}
                    data-umami-event={DETALJER.AAPNE_ALLE_RADER}
                    icon={
                      toggleAllRows ? (
                        <ChevronUpIcon title="Pil opp" />
                      ) : (
                        <ChevronDownIcon title="Pil ned" />
                      )
                    }
                    iconPosition="right"
                    variant="tertiary"
                    onClick={handleToggleAllRows}
                  >
                    {toggleAllRows ? "Lukk alle" : "Åpne alle"}
                  </Button>
                </div>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {attestasjonlinjer.map((linje, index) => (
              <RowWrapper
                key={"row" + index}
                linje={linje}
                index={index}
                openRows={openRows}
                handleRowToggle={handleRowToggle}
                handleTextFieldChange={handleTextFieldChange}
                toggleCheckbox={toggleCheckbox}
              >
                <Tooltip content={linje.kontonummer}>
                  <Table.DataCell>
                    {linje.properties.vises && linje.kodeKlasse}
                  </Table.DataCell>
                </Tooltip>
                <Table.DataCell align="center">
                  {linje.properties.vises && linje.delytelseId}
                </Table.DataCell>
                <Table.DataCell align="center">
                  {linje.properties.vises && formaterTilNorskTall(linje.sats)}
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
                    <div className={styles["input--ugyldigfom"]}>
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
                        onBlur={() => {
                          logUserEvent(DETALJER.REDIGERTE_DATO, {
                            dato: linje.properties
                              .activelyChangedDatoUgyldigFom,
                          });
                        }}
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
                {
                  // Viser en ekstra celle for å ikke bryte raden med knapper fra expandablerow
                  !linje.properties.vises && <Table.DataCell> </Table.DataCell>
                }
              </RowWrapper>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
