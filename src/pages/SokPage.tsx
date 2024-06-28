import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
import { Alert, Button, Heading, TextField } from "@navikt/ds-react";
import ContentLoader from "../components/common/ContentLoader";
import {
  TrefflisteSearchParameters,
  TrefflisteSearchParametersSchema,
} from "../models/TrefflisteSearchParameters";
import RestService from "../services/rest-service";
import commonstyles from "../util/common-styles.module.css";
import {
  anyOppdragExists,
  isEmpty,
  retrieveId,
  storeId,
} from "../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const { mutate } = useSWRConfig();
  const [trefflisteSokParameters, setTrefflisteSokParameters] =
    useState<TrefflisteSearchParameters>({
      gjelderID: retrieveId(),
    });

  const [shouldGoToTreffliste, setShouldGoToTreffliste] =
    useState<boolean>(false);

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
    setShouldGoToTreffliste(true);
    setTrefflisteSokParameters({ gjelderID: gjelderID });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (Array.isArray(treffliste) && !isEmpty(treffliste) && !isLoading) {
      const gjelderId = trefflisteSokParameters.gjelderID;
      storeId(gjelderId);
      if (anyOppdragExists(treffliste) && shouldGoToTreffliste) {
        navigate("/treffliste");
        setShouldGoToTreffliste(false);
      }
    }
  }, [
    treffliste,
    isLoading,
    navigate,
    trefflisteSokParameters,
    shouldGoToTreffliste,
  ]);

  useEffect(() => {
    mutate("/gjeldersok", []);
  }, [trefflisteSokParameters, mutate]);

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
      </div>
      {isLoading && !!trefflisteSokParameters.gjelderID ? (
        <ContentLoader />
      ) : null}
      {!isLoading && !anyOppdragExists(treffliste) && (
        <Alert variant="info">
          Ingen treff. Denne ID'en har ingen oppdrag.
        </Alert>
      )}
    </>
  );
}
