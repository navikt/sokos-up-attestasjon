import React, { useState } from "react";
import { Button, Checkbox, Loader, Table } from "@navikt/ds-react";
import { OppdragsLinje } from "../../types/OppdragsDetaljer";
import { dagensDato } from "../../util/DatoUtil";
import DetaljerTabellRow from "./DetaljerTabellRow";
import { enLinjePerAttestasjon } from "./detaljerUtils";

interface DetaljerTabellProps {
  antallAttestanter: number;
  oppdragslinjer: OppdragsLinje[];
  saksbehandlerIdent: string | undefined;
  handleSubmit: (linjer: StatefulLinje[]) => void;
  isLoading: boolean;
}

type Linjetype = "fjern" | "attester";

export type StatefulLinje = {
  activelyChangedDatoUgyldigFom?: string;
  attester: boolean;
  linje: OppdragsLinje;
  error?: string;
  fjern: boolean;
  suggestedDatoUgyldigFom?: string;
  vises: boolean;
};

export const DetaljerTabell = ({
  antallAttestanter,
  oppdragslinjer,
  handleSubmit,
  saksbehandlerIdent,
  isLoading,
}: DetaljerTabellProps) => {
  const [linjerMedEndringer, setLinjerMedEndringer] = useState(
    oppdragslinjer
      .map((o) =>
        enLinjePerAttestasjon(o, antallAttestanter, saksbehandlerIdent ?? "x"),
      )
      .flatMap(setOnlyFirstVisible),
  );

  function setOnlyFirstVisible(linjer: OppdragsLinje[]): StatefulLinje[] {
    return linjer.map((l, index) => ({
      activelyChangedDatoUgyldigFom: "",
      attester: false,
      error: "",
      linje: l,
      fjern: false,
      suggestedDatoUgyldigFom: "",
      vises: index == 0,
    }));
  }

  const handleStateChange = (index: number, newState: StatefulLinje) => {
    setLinjerMedEndringer(
      linjerMedEndringer.map((component, i) =>
        i === index ? newState : component,
      ),
    );
  };

  function lines(type: Linjetype) {
    return type === "attester"
      ? linjerMedEndringer.filter(
          (linje) => linje.linje.attestasjoner.length == 0,
        )
      : /* type === "fjern"   */ oppdragslinjer.filter(
          (linje) => linje.attestasjoner.length > 0,
        );
  }

  function checkedStatus(type: Linjetype) {
    const numberOfChecked = linjerMedEndringer.filter((l) =>
      type == "fjern"
        ? l.fjern && l.linje.attestasjoner.length > 0
        : /* type=="attester" */ l.attester &&
          l.linje.attestasjoner.length == 0,
    ).length;

    if (numberOfChecked == lines(type).length) return "alle";
    else if (numberOfChecked > 0) return "noen";
    else return "ingen";
  }

  function handleToggleAll(type: Linjetype) {
    if (checkedStatus(type) === "alle") {
      // alle var huket av fra før
      setLinjerMedEndringer((prev) =>
        prev.map((l) => ({
          ...l,
          attester: type === "attester" ? false : l.attester,
          fjern: type === "fjern" ? false : l.fjern,
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

  function avattesterAlle() {
    return (
      <Checkbox
        checked={lines("fjern").length > 0 && checkedStatus("fjern") === "alle"}
        indeterminate={checkedStatus("fjern") === "noen"}
        onChange={() => handleToggleAll("fjern")}
        disabled={lines("fjern").length === 0}
      >
        Avattester alle
      </Checkbox>
    );
  }

  function attesterAlle() {
    return (
      <Button
        type={"submit"}
        size={"medium"}
        onClick={() => handleSubmit(linjerMedEndringer)}
        disabled={isLoading}
      >
        {isLoading ? <Loader size={"small"} /> : "Oppdater"}
      </Button>
    );
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
            <Table.HeaderCell scope="col">{avattesterAlle()}</Table.HeaderCell>
            <Table.HeaderCell scope="col">{attesterAlle()}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {linjerMedEndringer.map((le, index) => (
            <DetaljerTabellRow
              linjeMedEndring={le}
              handleStateChange={handleStateChange}
              index={index}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
