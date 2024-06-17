import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
import { Button, Heading, Table, TextField } from "@navikt/ds-react";
import {
  TrefflisteSearchParameters,
  TrefflisteSearchParametersSchema,
} from "../models/TrefflisteSearchParameters";
import RestService from "../services/rest-service";
import commonstyles from "../util/common-styles.module.css";
import { retrieveId } from "../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const oppdrag = RestService.useFetchOppdrag();
  const [trefflisteSokParameters, setTrefflisteSokParameters] =
    useState<TrefflisteSearchParameters>({
      gjelderID: retrieveId(),
    });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TrefflisteSearchParameters>({
    resolver: zodResolver(TrefflisteSearchParametersSchema),
  });

  const handleChangeGjelderId: SubmitHandler<TrefflisteSearchParameters> = (
    data,
  ) => {
    const gjelderID = data.gjelderID?.replaceAll(/[\s.]/g, "") ?? "";
    setTrefflisteSokParameters({ gjelderID: gjelderID });
  };

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon
        </Heading>
      </div>
      <div className={styles.sok_sok}>
        <Heading level="2" size="medium" spacing>
          Søk
        </Heading>
        <form onSubmit={handleSubmit(handleChangeGjelderId)}>
          <div className={styles.sok_inputfields}>
            <TextField
              label="Gjelder ID"
              {...register("gjelderID")}
              defaultValue={trefflisteSokParameters.gjelderID}
              id="gjelderID"
              error={errors.gjelderID?.message}
            />
            <Button
              variant="primary"
              icon={<MagnifyingGlassIcon />}
              iconPosition="right"
              onClick={() => trigger()}
            >
              Søk
            </Button>
          </div>
        </form>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Oppdrags ID</Table.HeaderCell>
              <Table.HeaderCell>Faggruppe</Table.HeaderCell>
              <Table.HeaderCell>Fagsystem ID</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {oppdrag.data?.map((o) => (
              <Table.Row key={o.oppdragsId}>
                <Table.DataCell>{o.oppdragsId}</Table.DataCell>
                <Table.DataCell>{o.navnFagGruppe}</Table.DataCell>
                <Table.DataCell>{o.fagsystemId}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}
