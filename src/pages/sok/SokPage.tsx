import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { EraserIcon, MagnifyingGlassIcon } from "@navikt/aksel-icons";
import {
  Alert,
  Button,
  ErrorSummary,
  Heading,
  HelpText,
  List,
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
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import { ErrorMessage } from "../../types/ErrorMessage";
import { HttpStatusCodeError } from "../../types/Errors";
import { FagGruppe } from "../../types/FagGruppe";
import { FagOmraade } from "../../types/FagOmraade";
import { SokeData } from "../../types/SokeData";
import { SokeDataToSokeParameter } from "../../types/SokeParameter";
import { SokeDataSchema } from "../../types/schema/SokeDataSchema";
import { isEmpty } from "../../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    setStoredSokeData,
    storedSokeData,
    setStoredPaginatedOppdragList,
    resetState,
  } = useStore.getState();

  const { data: faggrupper } = useFetchFaggrupper();
  const { data: fagomraader } = useFetchFagomraader();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState,
    control,
    formState: { errors },
  } = useForm<SokeData>({
    resolver: zodResolver(SokeDataSchema),
  });

  useEffect(() => {
    if (storedSokeData) {
      setValue("gjelderId", storedSokeData.gjelderId);
      setValue("fagSystemId", storedSokeData.fagSystemId);
      setValue("fagGruppe", storedSokeData.fagGruppe);
      setValue("fagOmraade", storedSokeData.fagOmraade);
      setValue("attestertStatus", storedSokeData.attestertStatus);
    }
  }, [setValue, storedSokeData]);

  const faggruppetypeLabelMap = faggrupper
    ? faggrupper.reduce(
        (map, faggruppe) => {
          map[faggruppe.type] = faggruppe.navn;
          return map;
        },
        {} as Record<string, string>,
      )
    : ({} as Record<string, string>);

  const fagomraadetypeLabelMap = fagomraader
    ? fagomraader.reduce(
        (map, fagomraade) => {
          map[fagomraade.kode] = fagomraade.navn;
          return map;
        },
        {} as Record<string, string>,
      )
    : ({} as Record<string, string>);

  const filteredErrors = [...Object.keys(errors)].filter((m) => m);

  function onSubmit(sokeData: SokeData) {
    resetState();
    setStoredSokeData(sokeData);
    setIsLoading(true);
    setError(null);

    const sokeParameter = SokeDataToSokeParameter.parse(sokeData);

    hentOppdrag(sokeParameter)
      .then((response) => {
        setIsLoading(false);
        setError(null);
        if (!isEmpty(response.data)) {
          setStoredPaginatedOppdragList(response);
          navigate("/treffliste");
        } else {
          setError({
            variant: "info",
            message:
              "Ingen treff på søket. Prøv igjen med andre søkekriterier.",
          });
        }
      })
      .catch((error) => {
        const statusError = error as HttpStatusCodeError;
        setError({
          variant: statusError.statusCode == 400 ? "warning" : "error",
          message: statusError.message,
        });
        setIsLoading(false);
      });
  }

  function handleReset(e: FormEvent) {
    e.preventDefault();
    setError(null);
    reset();
    resetState();
  }

  function convertFagomraadeToComboboxValue(selectedFagomraade: FagOmraade) {
    return {
      value: selectedFagomraade.kode,
      label: `${selectedFagomraade.navn}(${selectedFagomraade.kode})`,
    };
  }

  function convertFaggruppeToComboboxValue(selectedFaggruppe: FagGruppe) {
    return {
      value: selectedFaggruppe.type,
      label: `${selectedFaggruppe.navn}(${selectedFaggruppe.type})`,
    };
  }

  const Divider = () => <div className={styles["divider"]} />;

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Søk
        </Heading>
      </div>
      <div className={styles["sok"]}>
        <>
          <div className={styles["sok-helptext"]}>
            <HelpText title="Søkekriterier" placement="left" strategy="fixed">
              <List
                as="ul"
                size="small"
                title="Minimum ett av kriteriene må være utfylt"
              >
                <List.Item>Faggruppe og Ikke attestere</List.Item>
                <List.Item>Fagområde og Ikke attesterte</List.Item>
                <List.Item>Gjelder</List.Item>
                <List.Item>Fagsystem id og fagområde</List.Item>
              </List>
            </HelpText>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles["sok-form"]}>
              <div className={styles["sok-inputfields"]}>
                <div className={styles["sok-gjelder"]}>
                  <TextField
                    label="Gjelder"
                    size={"small"}
                    error={errors.gjelderId?.message}
                    id="gjelderId"
                    {...register("gjelderId", {
                      setValueAs: (value: string) => value.trim(),
                    })}
                  />
                </div>
                <div className={styles["sok-fagsystem"]}>
                  <TextField
                    size={"small"}
                    id="fagSystemId"
                    label="Fagsystem id"
                    {...register("fagSystemId")}
                    error={errors.fagSystemId?.message}
                  />
                </div>
                <div className={styles["combobox"]}>
                  <Controller
                    control={control}
                    name={"fagGruppe"}
                    render={({ field }) => (
                      <UNSAFE_Combobox
                        error={
                          formState.errors.fagGruppe?.message
                            ? "Ikke gyldig verdi"
                            : undefined
                        }
                        isMultiSelect={false}
                        size={"small"}
                        label={"Faggruppe"}
                        onToggleSelected={(type, isSelected) => {
                          if (isSelected) {
                            field.onChange(
                              faggrupper?.find((f) => f.type == type),
                            );
                            setValue("fagOmraade", undefined);
                          } else {
                            setValue("fagGruppe", undefined);
                          }
                        }}
                        options={
                          faggrupper?.map(convertFaggruppeToComboboxValue) ?? []
                        }
                        selectedOptions={[
                          {
                            label: field.value
                              ? faggruppetypeLabelMap[field.value.type] +
                                ` (${field.value.type})`
                              : "",
                            value: field.value?.type ?? "",
                          },
                        ]}
                        shouldAutocomplete={true}
                      ></UNSAFE_Combobox>
                    )}
                  />
                </div>

                <div className={styles["combobox"]}>
                  <Controller
                    control={control}
                    name={"fagOmraade"}
                    render={({ field }) => (
                      <UNSAFE_Combobox
                        error={
                          formState.errors.fagOmraade?.message
                            ? "Ikke gyldig verdi"
                            : undefined
                        }
                        isMultiSelect={false}
                        size={"small"}
                        label={"Fagområde"}
                        onToggleSelected={(kode, isSelected) => {
                          if (isSelected) {
                            field.onChange(
                              fagomraader?.find((f) => f.kode == kode),
                            );
                            setValue("fagGruppe", undefined);
                          } else {
                            setValue("fagOmraade", undefined);
                          }
                        }}
                        options={
                          fagomraader?.map(convertFagomraadeToComboboxValue) ??
                          []
                        }
                        selectedOptions={[
                          {
                            label: field.value
                              ? fagomraadetypeLabelMap[field.value.kode] +
                                ` (${field.value.kode})`
                              : "",
                            value: field.value?.kode ?? "",
                          },
                        ]}
                        shouldAutocomplete={true}
                      ></UNSAFE_Combobox>
                    )}
                  />
                </div>
              </div>
              <Divider />
              <div className={styles["sok-radiobutton"]}>
                <RadioGroup
                  legend="Status"
                  name="attestertStatus"
                  defaultValue="false"
                  size={"small"}
                >
                  <Radio value="false" {...register("attestertStatus")}>
                    Ikke attestert
                  </Radio>
                  <Radio value="true" {...register("attestertStatus")}>
                    Attestert
                  </Radio>
                  <Radio value="alle" {...register("attestertStatus")}>
                    Alle
                  </Radio>
                </RadioGroup>
              </div>
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
                size={"small"}
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
                size={"small"}
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
          <Alert variant={error.variant} role="status">
            {error.message}
          </Alert>
        </div>
      )}
    </>
  );
}
