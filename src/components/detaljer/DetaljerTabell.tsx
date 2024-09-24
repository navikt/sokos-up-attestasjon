import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertProps,
  Button,
  Checkbox,
  Loader,
  Table,
} from "@navikt/ds-react";
import { BASE_URI, axiosPostFetcher } from "../../api/config/apiConfig";
import { AttesterOppdragResponse } from "../../api/models/AttesterOppdragResponse";
import { OppdragsLinje } from "../../types/OppdragsDetaljer";
import { dagensDato } from "../../util/DatoUtil";
import { createRequestPayload } from "../../util/createRequestPayload";
import styles from "./DetaljerTabell.module.css";
import DetaljerTabellRow from "./DetaljerTabellRow";

interface DetaljerTabellProps {
  antallAttestanter: number;
  oppdragslinjer: OppdragsLinje[];
  gjelderId: string | undefined;
  fagSystemId: string | undefined;
  kodeFagOmraade: string | undefined;
  oppdragsId: number;
  mutate: () => void;
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
  gjelderId,
  fagSystemId,
  kodeFagOmraade,
  oppdragsId,
  mutate,
}: DetaljerTabellProps) => {
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AttesterOppdragResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [linjerMedEndringer, setLinjerMedEndringer] = useState(
    oppdragslinjer.map(enLinjePerAttestasjon).flatMap(setOnlyFirstVisible),
  );

  function enLinjePerAttestasjon(linje: OppdragsLinje): OppdragsLinje[] {
    const enLinjeForHverEksisterendeAttestasjon: OppdragsLinje[] =
      linje.attestasjoner.map((a) => ({
        ...linje,
        attestasjoner: [a],
      }));
    const enLinjeUtenAttestasjon: OppdragsLinje = {
      ...linje,
      attestasjoner: [],
    };

    return antallAttestanter > 1
      ? [...enLinjeForHverEksisterendeAttestasjon, enLinjeUtenAttestasjon]
      : [linje];
  }

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

  useEffect(() => {
    if (showAlert) setTimeout(() => setShowAlert(false), 10000);
  }, [showAlert]);

  function lines(type: Linjetype) {
    return type === "attester"
      ? linjerMedEndringer.filter(
          (linje) => linje.linje.attestasjoner.length === 0,
        )
      : /* type === "fjern"   */ oppdragslinjer.filter(
          (linje) => linje.attestasjoner.length > 0,
        );
  }

  function checkedStatus(type: Linjetype) {
    const numberOfChecked = linjerMedEndringer.filter((l) =>
      type == "fjern" ? l.fjern : l.attester,
    );
    if (numberOfChecked.length === lines(type).length) return "alle";
    else if (numberOfChecked.length > 1) return "noen";
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
      // ingen var huket av fra før
      // noen var huket av fra før
      setLinjerMedEndringer((prev) =>
        prev.map((l) => ({
          ...l,
          attester: type === "attester" ? true : l.attester,
          fjern: type === "fjern" ? true : l.fjern,
          suggestedDatoUgyldigFom: l.linje.oppdragsLinje.attestert
            ? dagensDato()
            : "31.12.9999",
        })),
      );
    }
  }

  const handleSubmit = async () => {
    if (linjerMedEndringer.filter((l) => !!l.error).length > 0) {
      setError("Du må rette feil i datoformat før du kan oppdatere");
      return;
    }

    const payload = createRequestPayload(
      fagSystemId ?? "",
      kodeFagOmraade ?? "",
      gjelderId ?? "",
      oppdragsId,
      oppdragslinjer,
      linjerMedEndringer,
    );

    setIsLoading(true);
    try {
      const response = await axiosPostFetcher<
        typeof payload,
        AttesterOppdragResponse
      >(BASE_URI.ATTESTASJON, "/attestere", payload);
      setResponse(response);
      setError(null);
      setShowAlert(true);
      mutate();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(`Error: ${error.response?.data?.message}`);
      } else {
        setError("En uventet feil har skjedd");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className={styles.detaljer__alert}>
          <Alert variant="error">{error}</Alert>
        </div>
      )}
      {response && showAlert && (
        <div className={styles.detaljer__alert}>
          <AlertWithCloseButton variant="success">
            Oppdatering vellykket.{" "}
            {
              response.OSAttestasjonOperationResponse.Attestasjonskvittering
                .ResponsAttestasjon.AntLinjerMottatt
            }{" "}
            linjer oppdatert.
          </AlertWithCloseButton>
        </div>
      )}
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
            <Table.HeaderCell scope="col">
              <Button
                type={"submit"}
                size={"medium"}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? <Loader size={"small"} /> : "Oppdater"}
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
            />
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

const AlertWithCloseButton = ({
  children,
  variant,
}: {
  children?: React.ReactNode;
  variant: AlertProps["variant"];
}) => {
  const [show, setShow] = React.useState(true);

  return show ? (
    <Alert variant={variant} closeButton onClose={() => setShow(false)}>
      {children || "Content"}
    </Alert>
  ) : null;
};
