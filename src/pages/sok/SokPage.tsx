import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { EraserIcon, MagnifyingGlassIcon } from "@navikt/aksel-icons";
import {
  Alert,
  Button,
  ErrorSummary,
  Heading,
  Radio,
  RadioGroup,
  TextField,
  UNSAFE_Combobox,
} from "@navikt/ds-react";
import {
  hentOppdrag,
  useFetchFaggrupper,
  useFetchFagomraader,
} from "../../api/apiService";
import ClearButton from "../../components/ClearButton";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import { FagGruppe } from "../../types/FagGruppe";
import { FagOmraade } from "../../types/FagOmraade";
import { SokeData } from "../../types/SokeData";
import { SokeParameter } from "../../types/SokeParameter";
import { SokeDataSchema } from "../../types/schema/SokeDataSchema";
import { isEmpty } from "../../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFagomraade, setSelectedFagomraade] = useState<
    FagOmraade | undefined
  >(undefined);
  const [selectedFaggruppe, setSelectedFaggruppe] = useState<
    FagGruppe | undefined
  >(undefined);
  const {
    setStoredSokeData,
    setOppdrag,
    setStoredOppdrag,
    setGjelderNavn,
    resetState,
  } = useStore.getState();

  const { data: faggrupper } = useFetchFaggrupper();
  const { data: fagomraader } = useFetchFagomraader();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SokeData>({
    resolver: zodResolver(SokeDataSchema),
    defaultValues: {
      attestertStatus: "false",
      gjelderId: undefined,
      fagGruppe: undefined,
      fagOmraade: undefined,
      fagSystemId: undefined,
    },
  });

  const filteredErrors = [...Object.keys(errors)].filter((m) => m);

  function onSubmit(sokeData: SokeData) {
    setStoredSokeData(sokeData);
    setOppdrag(undefined);
    setGjelderNavn("");
    setIsLoading(true);
    setError(null);

    const sokeParameter: SokeParameter = {
      gjelderId: sokeData?.gjelderId,
      fagSystemId: sokeData?.fagSystemId,
      kodeFagGruppe: selectedFaggruppe?.type,
      kodeFagOmraade: selectedFagomraade?.kode,
      attestert:
        sokeData.attestertStatus === "true"
          ? true
          : sokeData.attestertStatus === "false"
            ? false
            : null,
    };

    hentOppdrag(sokeParameter)
      .then((response) => {
        setIsLoading(false);
        setError(null);
        if (!isEmpty(response)) {
          setStoredOppdrag(response);
          navigate("/treffliste");
        } else {
          setError("Ingen treff på søket. Prøv igjen med andre søkekriterier.");
        }
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }

  function handleReset(e: FormEvent) {
    e.preventDefault();
    setSelectedFaggruppe(undefined);
    setSelectedFagomraade(undefined);
    setError(null);
    reset();
    resetState();
  }

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon
        </Heading>
      </div>
      <div className={styles["sok"]}>
        <Heading level="2" size="medium" spacing>
          Søk
        </Heading>
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles["sok-form"]}>
              <TextField
                label="Gjelder"
                error={errors.gjelderId?.message}
                id="gjelderId"
                {...register("gjelderId", {
                  setValueAs: (value: string) => value.trim(),
                })}
              />
              <TextField
                id="fagSystemId"
                label="Fagsystem id"
                {...register("fagSystemId")}
                error={errors.fagSystemId?.message}
              />
              <div className={styles["combobox"]}>
                <UNSAFE_Combobox
                  id="fagGruppe"
                  label="Faggruppe"
                  clearButton={false}
                  options={
                    faggrupper?.map((faggruppe) => ({
                      value: faggruppe.type,
                      label: faggruppe.navn + "(" + faggruppe.type + ")",
                    })) || []
                  }
                  error={errors.fagGruppe?.message}
                  selectedOptions={
                    selectedFaggruppe
                      ? [
                          {
                            value: selectedFaggruppe.type,
                            label:
                              selectedFaggruppe.navn +
                              "(" +
                              selectedFaggruppe.type +
                              ")",
                          },
                        ]
                      : []
                  }
                  onToggleSelected={(option, isSelected) => {
                    if (isSelected) {
                      const fagGruppe = faggrupper?.find(
                        (f) => f.type === option,
                      );
                      setValue("fagGruppe", {
                        navn: fagGruppe?.navn ?? "",
                        type: option,
                      });
                      setSelectedFaggruppe(fagGruppe);
                      setSelectedFagomraade(undefined);
                    }
                  }}
                />
                <div className={styles["combobox-clear-button"]}>
                  <ClearButton
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedFaggruppe(undefined);
                    }}
                  />
                </div>
              </div>

              <div className={styles["combobox"]}>
                <UNSAFE_Combobox
                  id="kodeFagOmraade"
                  label="Fagområde"
                  clearButton={false}
                  options={
                    fagomraader?.map((fagomraade) => ({
                      value: fagomraade.kode,
                      label: fagomraade.navn + "(" + fagomraade.kode + ")",
                    })) || []
                  }
                  error={errors.fagOmraade?.message}
                  selectedOptions={
                    selectedFagomraade
                      ? [
                          {
                            value: selectedFagomraade.kode,
                            label:
                              selectedFagomraade.navn +
                              "(" +
                              selectedFagomraade.kode +
                              ")",
                          },
                        ]
                      : []
                  }
                  onToggleSelected={(option, isSelected) => {
                    if (isSelected) {
                      const fagomraade = fagomraader?.find(
                        (f) => f.kode === option,
                      );
                      setValue("fagOmraade", {
                        navn: fagomraade?.navn ?? "",
                        kode: option,
                      });
                      setSelectedFagomraade(fagomraade);
                      setSelectedFaggruppe(undefined);
                    }
                  }}
                />
                <div className={styles["combobox-clear-button"]}>
                  <ClearButton
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedFagomraade(undefined);
                    }}
                  />
                </div>
              </div>

              <RadioGroup
                legend="Status"
                name="attestertStatus"
                defaultValue="false"
              >
                <Radio value="true" {...register("attestertStatus")}>
                  Attestert
                </Radio>
                <Radio value="false" {...register("attestertStatus")}>
                  Ikke attestert
                </Radio>
                <Radio value="undefined" {...register("attestertStatus")}>
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
                loading={isLoading}
                icon={
                  <MagnifyingGlassIcon title="Ikon som viser et forstørrelsesglass" />
                }
                iconPosition="right"
              >
                Søk
              </Button>
              <Button
                variant="secondary"
                iconPosition="right"
                icon={<EraserIcon title="reset søk" />}
                onClick={handleReset}
              >
                Nullstill søk
              </Button>
            </div>
          </form>
        </>
      </div>
      {error && (
        <div className={styles["sok-error"]}>
          <Alert variant="info">{error}</Alert>
        </div>
      )}
    </>
  );
}
