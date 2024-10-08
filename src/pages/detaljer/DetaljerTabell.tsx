import React, { useEffect, useState } from "react";
import { Button, Checkbox, Loader, Table } from "@navikt/ds-react";
import { OppdragsLinje } from "../../types/OppdragsDetaljer";
import { dagensDato } from "../../util/datoUtil";
import DetaljerTabellRow from "./DetaljerTabellRow";
import { enLinjePerAttestasjon } from "./detaljerUtils";

type DetaljerTabellProps = {
  antallAttestanter: number;
  oppdragslinjer: OppdragsLinje[];
  saksbehandlerIdent: string | undefined;
  handleSubmit: (linjer: StatefulLinje[]) => void;
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
    props.oppdragslinjer
      .map((o) =>
        enLinjePerAttestasjon(
          o,
          props.antallAttestanter,
          props.saksbehandlerIdent ?? "x",
        ),
      )
      .flatMap(setOnlyFirstVisible),
  );

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

  const handleStateChange = (index: number, newState: StatefulLinje) => {
    const newLinjer = linjerMedEndringer.map((component, i) =>
      i === index ? newState : component,
    );
    if (!newLinjer.some((l) => l.dateError))
      props.setAlertError((oldAlert) =>
        !!oldAlert &&
        oldAlert == "Du må rette feil i datoformat før du kan oppdatere"
          ? null
          : oldAlert,
      );
    if (newLinjer.some((l) => l.attester || l.fjern))
      props.setAlertError((oldAlert) =>
        !!oldAlert &&
        oldAlert == "Du må velge minst en linje før du kan oppdatere"
          ? null
          : oldAlert,
      );
    setLinjerMedEndringer(newLinjer);
  };

  function getLinjetype(type: Linjetype) {
    return type === "attester"
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

  useEffect(() => {
    setLinjerMedEndringer(
      props.oppdragslinjer
        .map((oppdrag) =>
          enLinjePerAttestasjon(
            oppdrag,
            props.antallAttestanter,
            props.saksbehandlerIdent ?? "x",
          ),
        )
        .flatMap(setOnlyFirstVisible),
    );
  }, [props.oppdragslinjer, props.antallAttestanter, props.saksbehandlerIdent]);

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
                onClick={() => props.handleSubmit(linjerMedEndringer)}
                disabled={props.isLoading}
              >
                {props.isLoading ? <Loader size={"small"} /> : "Oppdater"}
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {linjerMedEndringer.map((le, index) => (
            <DetaljerTabellRow
              linjeMedEndring={le}
              handleStateChange={handleStateChange}
              index={index}
              key={index}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
