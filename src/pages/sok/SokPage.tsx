import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
import commonStyles from "../../styles/common-styles.module.css";
import { ErrorMessage } from "../../types/ErrorMessage";
import { FagGruppe } from "../../types/FagGruppe";
import { FagOmraade } from "../../types/FagOmraade";
import { SokeData } from "../../types/SokeData";
import { SokeDataToSokeParameter } from "../../types/SokeParameter";
import { AttestertStatus } from "../../types/schema/AttestertStatus";
import { SokeDataSchema } from "../../types/schema/SokeDataSchema";
import { SOK } from "../../umami/umami";
import { isEmpty } from "../../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setSokeData, sokeData, setOppdragList, resetState } = useStore();

  const { data: faggrupper, isLoading: faggrupperIsLoading } =
    useFetchFaggrupper();
  const { data: fagomraader, isLoading: fagomraaderIsLoading } =
    useFetchFagomraader();

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
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (sokeData) {
      setValue("gjelderId", sokeData.gjelderId);
      setValue("fagSystemId", sokeData.fagSystemId);
      setValue("fagGruppe", sokeData.fagGruppe);
      setValue("fagOmraade", sokeData.fagOmraade);
      setValue("alternativer", sokeData.alternativer);
    }
  }, [setValue, sokeData]);

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
    setSokeData(sokeData);
    setIsLoading(true);
    setError(null);

    const sokeParameter = SokeDataToSokeParameter.parse(sokeData);

    hentOppdrag(sokeParameter)
      .then((response) => {
        setIsLoading(false);
        setError(null);
        if (!isEmpty(response)) {
          setOppdragList(response);
          navigate("/treffliste", { replace: false });
        } else {
          setError({
            variant: "info",
            message:
              "Ingen treff på søket. Prøv igjen med andre søkekriterier.",
          });
        }
      })
      .catch((error) => {
        setError({
          variant: error.statusCode == 400 ? "warning" : "error",
          message: error.message,
        });
        setIsLoading(false);
      });
  }

  function handleReset(e: FormEvent) {
    e.preventDefault();
    setError(null);
    resetState();
    reset();
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

  const Divider = () => <div className={styles["attestasjonsok-divider"]} />;

  return (
    <>
      <div className={commonStyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Søk
        </Heading>
      </div>
      <div className={styles["attestasjonsok"]}>
        <>
          <div className={styles["attestasjonsok-helptext"]}>
            <HelpText title="Søkekriterier" placement="left" strategy="fixed">
              <List
                as="ul"
                size="small"
                title="Minimum ett av kriteriene må være utfylt"
              >
                <List.Item>Faggruppe og Ikke attestere</List.Item>
                <List.Item>Fagområde og Ikke attesterte</List.Item>
                <List.Item>Gjelder</List.Item>
                <List.Item>Fagsystem id (minst 4 tegn) og Fagområde</List.Item>
              </List>
            </HelpText>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles["attestasjonsok-form"]}>
              <div className={styles["attestasjonsok-inputfields"]}>
                <div className={styles["attestasjonsok-gjelder"]}>
                  <TextField
                    label="Gjelder"
                    size={"small"}
                    error={
                      errors.gjelderId?.message && (
                        <span
                          className={
                            styles["attestasjonsok-error-message-nowrap"]
                          }
                        >
                          {errors.gjelderId?.message}
                        </span>
                      )
                    }
                    id="gjelderId"
                    {...register("gjelderId", {
                      setValueAs: (value: string) => value.trim(),
                    })}
                  />
                </div>
                <div className={styles["attestasjonsok-fagsystem"]}>
                  <TextField
                    size={"small"}
                    id="fagSystemId"
                    label="Fagsystem id"
                    {...register("fagSystemId")}
                    error={errors.fagSystemId?.message}
                  />
                </div>
                <div className={styles["attestasjonsok-combobox"]}>
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
                        isLoading={faggrupperIsLoading}
                      ></UNSAFE_Combobox>
                    )}
                  />
                </div>

                <div className={styles["attestasjonsok-combobox"]}>
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
                        isLoading={fagomraaderIsLoading}
                      ></UNSAFE_Combobox>
                    )}
                  />
                </div>
              </div>
              <Divider />
              <div className={styles["attestasjonsok-radiobutton"]}>
                <RadioGroup
                  legend="Status"
                  name="alternativer"
                  defaultValue={AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE}
                  size={"small"}
                >
                  <Radio
                    value={AttestertStatus.IKKE_FERDIG_ATTESTERT_EKSL_EGNE}
                    {...register("alternativer")}
                  >
                    Ikke ferdig attestert eksl. egne
                  </Radio>
                  <Radio
                    value={AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE}
                    {...register("alternativer")}
                  >
                    Ikke ferdig attestert inkl. egne
                  </Radio>
                  <Radio
                    value={AttestertStatus.ATTESTERT}
                    {...register("alternativer")}
                  >
                    Attestert
                  </Radio>
                  <Radio
                    value={AttestertStatus.ALLE}
                    {...register("alternativer")}
                  >
                    Alle
                  </Radio>
                  <Radio
                    value={AttestertStatus.EGEN_ATTESTERTE}
                    {...register("alternativer")}
                  >
                    Egne attesterte
                  </Radio>
                </RadioGroup>
              </div>
            </div>
            {filteredErrors.length > 0 && (
              <div className={styles["attestasjonsok-error-summary"]}>
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
            <div className={styles["attestasjonsok-button"]}>
              <Button
                data-umami-event={SOK.SUBMIT}
                data-umami-event-fnr={
                  !!sokeData?.gjelderId &&
                  /^(?!00)\d{11}$/.test(sokeData?.gjelderId)
                }
                data-umami-event-orgnr={
                  !!sokeData?.gjelderId &&
                  /^(00\d{9}|\d{9})$/.test(sokeData?.gjelderId)
                }
                data-umami-event-fagsystemid={!!sokeData?.fagSystemId}
                data-umami-event-faggruppe={sokeData?.fagGruppe?.type}
                data-umami-event-fagomraade={sokeData?.fagOmraade?.kode}
                data-umami-event-attestert={sokeData?.alternativer}
                id={"search"}
                type="submit"
                size={"small"}
                loading={isLoading}
                icon={<MagnifyingGlassIcon aria-hidden />}
                iconPosition="right"
              >
                Søk
              </Button>
              <Button
                data-umami-event={SOK.RESET}
                id={"nullstill"}
                variant="secondary"
                size={"small"}
                iconPosition="right"
                icon={<EraserIcon aria-hidden />}
                onClick={handleReset}
              >
                Nullstill søk
              </Button>
            </div>
          </form>
        </>
      </div>
      {error && (
        <div className={styles["attestasjonsok-error"]}>
          <Alert variant={error.variant} role="status">
            {error.message}
          </Alert>
        </div>
      )}
    </>
  );
}
