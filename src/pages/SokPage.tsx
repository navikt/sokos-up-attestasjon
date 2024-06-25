import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
import { Button, Heading, TextField } from "@navikt/ds-react";
import { TreffTabell } from "../components/treffliste/TreffTabell";
import {
  TrefflisteSearchParameters,
  TrefflisteSearchParametersSchema,
} from "../models/TrefflisteSearchParameters";
import RestService from "../services/rest-service";
import commonstyles from "../util/common-styles.module.css";
import { retrieveId } from "../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const [trefflisteSokParameters, setTrefflisteSokParameters] =
    useState<TrefflisteSearchParameters>({
      gjelderID: retrieveId(),
    });

  const { treffliste, isLoading } = RestService.useFetchTreffliste(
    trefflisteSokParameters.gjelderID,
  );

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
            <div className={styles.sok_button}>
              <Button
                variant="primary"
                icon={<MagnifyingGlassIcon />}
                iconPosition="right"
                onClick={() => trigger()}
              >
                Søk
              </Button>
            </div>
          </div>
        </form>
        {isLoading && trefflisteSokParameters.gjelderID ? (
          <div>Laster...</div>
        ) : treffliste && treffliste.length > 0 ? (
          <TreffTabell treffliste={treffliste} />
        ) : null}
      </div>
    </>
  );
}
