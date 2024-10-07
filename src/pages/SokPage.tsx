import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
import {
  Alert,
  Button,
  ErrorSummary,
  Heading,
  Loader,
  Radio,
  RadioGroup,
  TextField,
  UNSAFE_Combobox,
} from "@navikt/ds-react";
import { hentOppdrag } from "../api/config/apiService";
import { SokeData, SokeSchema } from "../components/form/SokeSchema";
import useFetchFaggrupper from "../hooks/useFetchFaggrupper";
import useFetchFagomraader from "../hooks/useFetchFagomraader";
import { useAppState } from "../store/AppState";
import commonstyles from "../styles/common-styles.module.css";
import { isEmpty } from "../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const navigate = useNavigate();
  const [sokeData, setSokeData] = useState<SokeData | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setStoredSokeData, setStoredOppdrag } = useAppState.getState();

  const { data: faggrupper } = useFetchFaggrupper();
  const { data: fagomraader } = useFetchFagomraader();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SokeData>({
    resolver: zodResolver(SokeSchema),
    defaultValues: {
      attestertStatus: false,
      gjelderId: undefined,
      kodeFagGruppe: [],
      kodeFagOmraade: [],
      fagSystemId: undefined,
    },
  });

  const filteredErrors = [...Object.keys(errors)].filter((m) => m);

  const onSubmit: SubmitHandler<SokeData> = (sokeData) => {
    const result = SokeSchema.safeParse(sokeData);
    if (!result.success) {
      setError("Noe gikk galt. Prøv igjen senere.");
      // Logger til Faro
    }
    setSokeData(sokeData);
    setStoredSokeData(sokeData);
    setIsLoading(true);
    setError(undefined);

    hentOppdrag(sokeData)
      .then((response) => {
        if (!isEmpty(response)) {
          setStoredOppdrag(response);
          navigate("/treffliste");
        } else {
          setError("Ingen treff på søket. Prøv igjen med andre søkekriterier.");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        setError(
          "Noe gikk galt. Prøv igjen senere. Feilmelding: " + errorMessage,
        );
        setIsLoading(false);
      });
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
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.sok}>
              <TextField
                label="Gjelder"
                placeholder="Fødselsnummer eller organisasjonsnummer"
                defaultValue={sokeData?.gjelderId}
                error={errors.gjelderId?.message}
                id="gjelderId"
                {...register("gjelderId", {
                  setValueAs: (value: string) => value.trim(),
                })}
              />
              <TextField
                id="fagSystemId"
                label="Fagsystem id"
                defaultValue={sokeData?.fagSystemId}
                {...register("fagSystemId")}
                error={errors.fagSystemId?.message}
              />
              <UNSAFE_Combobox
                id="kodeFagGruppe"
                label="Faggruppe"
                options={
                  faggrupper?.map((faggruppe) => ({
                    value: faggruppe.type,
                    label: faggruppe.navn + "(" + faggruppe.type + ")",
                  })) || []
                }
                error={errors.kodeFagGruppe?.message}
                onToggleSelected={(option, isSelected) => {
                  if (isSelected) {
                    setValue("kodeFagGruppe", [
                      ...getValues("kodeFagGruppe"),
                      option,
                    ]);
                  } else {
                    setValue(
                      "kodeFagGruppe",
                      getValues("kodeFagGruppe").filter((v) => v !== option),
                    );
                  }
                }}
              />

              <UNSAFE_Combobox
                id="kodeFagOmraade"
                label="Fagområde"
                options={
                  fagomraader?.map((fagomraade) => ({
                    value: fagomraade.kode,
                    label: fagomraade.navn + "(" + fagomraade.kode + ")",
                  })) || []
                }
                error={errors.kodeFagOmraade?.message}
                onToggleSelected={(option, isSelected) => {
                  if (isSelected) {
                    setValue("kodeFagOmraade", [
                      ...getValues("kodeFagOmraade"),
                      option,
                    ]);
                  } else {
                    setValue(
                      "kodeFagOmraade",
                      getValues("kodeFagOmraade").filter((v) => v !== option),
                    );
                  }
                }}
              />

              <RadioGroup
                legend="Status"
                name="attestertStatus"
                defaultValue={false}
              >
                <Radio value={true} {...register("attestertStatus")}>
                  Attestert
                </Radio>
                <Radio value={false} {...register("attestertStatus")}>
                  Ikke attestert
                </Radio>
                <Radio value={null} {...register("attestertStatus")}>
                  Alle
                </Radio>
              </RadioGroup>
            </div>
            {filteredErrors.length > 0 && (
              <div className={styles["sok-error-summary"]}>
                <ErrorSummary
                  heading={"Du må fikse disse feilene før du kan fortsette"}
                >
                  {filteredErrors.map((e) => (
                    <ErrorSummary.Item key={e}>
                      {
                        (errors as { [key: string]: { message: string } })[e]
                          .message
                      }
                    </ErrorSummary.Item>
                  ))}
                </ErrorSummary>
              </div>
            )}
            <div className={styles["sok-button"]}>
              <Button
                type="submit"
                icon={
                  isLoading ? (
                    <Loader title={"Søker..."} />
                  ) : (
                    <MagnifyingGlassIcon title="Ikon som viser et forstørrelsesglass" />
                  )
                }
                iconPosition="right"
              >
                {isLoading ? "Søker..." : "Søk"}
              </Button>
            </div>
          </form>
        </>
      </div>
      {error && (
        <div className={styles.sok_error}>
          <Alert variant="info">{error}</Alert>
        </div>
      )}
    </>
  );
}
