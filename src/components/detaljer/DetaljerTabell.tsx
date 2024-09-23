import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Alert,
  AlertProps,
  Button,
  Checkbox,
  Loader,
  Table,
  TextField,
} from "@navikt/ds-react";
import { BASE_URI, axiosPostFetcher } from "../../api/config/apiConfig";
import { AttesterOppdragResponse } from "../../api/models/AttesterOppdragResponse";
import { OppdragsLinje } from "../../types/OppdragsDetaljer";
import {
  dagensDato,
  isoDatoTilNorskDato,
  validerDatoFormat,
} from "../../util/DatoUtil";
import { createRequestPayload } from "../../util/createRequestPayload";
import styles from "./DetaljerTabell.module.css";

interface DetaljerTabellProps {
  oppdragslinjer: OppdragsLinje[];
  gjelderId: string | undefined;
  fagSystemId: string | undefined;
  kodeFagOmraade: string | undefined;
  oppdragsId: number;
  mutate: () => void;
}

type Linjetype = "fjern" | "attester";

export type LinjeEndring = {
  linjeId: number;
  checked: boolean;
  activelyChangedDatoUgyldigFom?: string;
  suggestedDatoUgyldigFom?: string;
};

export const DetaljerTabell = ({
  oppdragslinjer,
  gjelderId,
  fagSystemId,
  kodeFagOmraade,
  oppdragsId,
  mutate,
}: DetaljerTabellProps) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [changes, setChanges] = useState<LinjeEndring[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AttesterOppdragResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [dateErrors, setDateErrors] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (showAlert) setTimeout(() => setShowAlert(false), 10000);
  }, [showAlert]);

  function toggleSelectedRow(
    event: ChangeEvent<HTMLInputElement>,
    linje: OppdragsLinje,
  ) {
    const id = linje.oppdragsLinje.linjeId;
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => id !== i) : [...prev, id],
    );

    const newChange: LinjeEndring = {
      checked: event.target.checked,
      suggestedDatoUgyldigFom: event.target.checked ? dagensDato() : undefined,
      linjeId: id,
    };

    setChanges((prev) => {
      return [...prev, newChange];
    });
  }

  function handleTextFieldChange(id: number, value: string) {
    setChanges((previousChanges) => {
      const oldChange = previousChanges.find((c) => c.linjeId == id);
      const newChange = !oldChange
        ? { activelyChangedDatoUgyldigFom: value, linjeId: id, checked: true }
        : { ...oldChange, activelyChangedDatoUgyldigFom: value };

      return [...previousChanges.filter((c) => c.linjeId !== id), newChange];
    });

    if (!validerDatoFormat(value)) {
      setDateErrors((prev) => ({ ...prev, [id]: "Ugyldig datoformat" }));
    } else {
      setDateErrors((prev) => {
        delete prev[id];
        return prev;
      });
    }
  }

  function lines(type: Linjetype) {
    return type === "attester"
      ? oppdragslinjer.filter((linje) => !linje.attestasjoner[0]?.attestant)
      : /* type === "fjern"   */ oppdragslinjer.filter(
          (linje) => linje.attestasjoner[0]?.attestant,
        );
  }

  function ids(type: Linjetype) {
    return lines(type).map((l) => l.oppdragsLinje.linjeId);
  }

  function checkedStatus(type: Linjetype) {
    const alle: boolean = !lines(type).some(
      (linje) => !selectedRows.includes(linje.oppdragsLinje.linjeId),
    );
    const noen: boolean = lines(type).some((linje) =>
      selectedRows.includes(linje.oppdragsLinje.linjeId),
    );

    if (alle) return "alle";
    else if (noen) return "noen";
    else return "ingen";
  }

  function handleToggleAll(type: Linjetype) {
    // alle var huket av fra før
    if (checkedStatus(type) === "alle") {
      setSelectedRows(selectedRows.filter((id) => !ids(type).includes(id)));
      setChanges((prev) => [
        ...prev.filter((change) => !ids(type).includes(change.linjeId)),
      ]);
    }
    // ingen var huket av fra før
    // noen var huket av fra før
    else {
      setSelectedRows((prev) => [...prev, ...ids(type)]);
      setChanges((prev) => [
        ...prev,
        ...lines(type).map((linje) => {
          return {
            checked: true,
            suggestedDatoUgyldigFom: linje.attestasjoner[0]?.attestant
              ? dagensDato()
              : "31.12.9999",
            linjeId: linje.oppdragsLinje.linjeId,
          };
        }),
      ]);
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(dateErrors).length > 0) {
      setError("Du må rette feil i datoformat før du kan oppdatere");
      return;
    }

    const payload = createRequestPayload(
      fagSystemId ?? "",
      kodeFagOmraade ?? "",
      gjelderId ?? "",
      oppdragsId,
      oppdragslinjer,
      selectedRows,
      changes,
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
      setSelectedRows([]);
      setChanges([]);
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
            Oppdatering vellykket.
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
          {oppdragslinjer.map((linje) => (
            <Table.Row
              key={linje.oppdragsLinje.linjeId}
              selected={selectedRows.includes(linje.oppdragsLinje.linjeId)}
            >
              <Table.DataCell>{linje.oppdragsLinje.kodeKlasse}</Table.DataCell>
              <Table.DataCell align="center">
                {linje.oppdragsLinje.delytelseId}
              </Table.DataCell>
              <Table.DataCell align="center">
                {linje.oppdragsLinje.sats.toFixed(2)}
              </Table.DataCell>
              <Table.DataCell>{linje.oppdragsLinje.typeSats}</Table.DataCell>
              <Table.DataCell>
                {isoDatoTilNorskDato(linje.oppdragsLinje.datoVedtakFom)} -{" "}
                {isoDatoTilNorskDato(linje.oppdragsLinje.datoVedtakTom)}
              </Table.DataCell>
              <Table.DataCell>
                {linje.attestasjoner[0]?.attestant}
              </Table.DataCell>
              <Table.DataCell>
                {linje.oppdragsLinje.attestert && (
                  <div className={styles.ugyldig_textfield}>
                    <TextField
                      size="small"
                      label="Ugyldig FOM"
                      hideLabel
                      value={
                        changes.find(
                          (c) => c.linjeId == linje.oppdragsLinje.linjeId,
                        )?.activelyChangedDatoUgyldigFom ||
                        (selectedRows.includes(linje.oppdragsLinje.linjeId) &&
                          changes.find(
                            (c) => c.linjeId == linje.oppdragsLinje.linjeId,
                          )?.suggestedDatoUgyldigFom) ||
                        isoDatoTilNorskDato(
                          linje.attestasjoner[0]?.datoUgyldigFom,
                        )
                      }
                      onChange={(e) =>
                        handleTextFieldChange(
                          linje.oppdragsLinje.linjeId,
                          e.target.value,
                        )
                      }
                      error={dateErrors[linje.oppdragsLinje.linjeId]}
                      disabled={
                        !selectedRows.includes(linje.oppdragsLinje.linjeId)
                      }
                    />
                  </div>
                )}
              </Table.DataCell>
              <Table.DataCell>
                <Checkbox
                  checked={selectedRows.includes(linje.oppdragsLinje.linjeId)}
                  onChange={(e) => toggleSelectedRow(e, linje)}
                >
                  {linje.oppdragsLinje.attestert ? "Fjern" : "Attester"}
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
