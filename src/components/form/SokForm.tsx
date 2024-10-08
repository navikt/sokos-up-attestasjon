import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
import {
  Button,
  ErrorSummary,
  Loader,
  Radio,
  RadioGroup,
} from "@navikt/ds-react";
import useFetchFaggrupper from "../../hooks/useFetchFaggrupper";
import useFetchFagomraader from "../../hooks/useFetchFagomraader";
import { SokeDataSchema } from "../../types/SokeData";
import FormField from "./FormField";
import styles from "./SokForm.module.css";
import { SokeData } from "./SokeSchema";
import SokosCombobox from "./SokosCombobox";

type SokFormProps = {
  sokedata: SokeData | undefined;
  isLoading?: boolean;
  onSubmit: (data: SokeData) => void;
};

function SokForm({ sokedata, isLoading, onSubmit }: SokFormProps) {
  const { data: faggrupper } = useFetchFaggrupper();
  const { data: fagomraader } = useFetchFagomraader();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SokeData>({
    resolver: zodResolver(SokeDataSchema),
  });

  const filteredErrors = [...Object.keys(errors)].filter((m) => m);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.sok}>
          <FormField
            name="gjelderId"
            label="Gjelder"
            placeholder={"Fødselsnummer eller organisasjonsnummer"}
            defaultValue={sokedata?.gjelderId}
            register={(name, options) => ({
              ...register(name, {
                ...options,
                setValueAs: (value: string) => value.trim(),
              }),
            })}
            error={errors.gjelderId}
          />
          <FormField
            name="fagSystemId"
            label="Fagsystem id"
            defaultValue={sokedata?.fagSystemId}
            register={register}
            error={errors.fagSystemId}
          />
          <SokosCombobox
            name="kodeFagGruppe"
            label={"Faggruppe"}
            faggrupper={
              faggrupper
                ? faggrupper
                    .map((f) => f.navn.trim() + "(" + f.type.trim() + ")")
                    .sort((a, b) => a.localeCompare(b))
                : []
            }
            register={register}
            setValue={setValue}
          />
          <SokosCombobox
            name="kodeFagOmraade"
            label={"Fagområde"}
            faggrupper={
              fagomraader
                ? fagomraader
                    .map((f) => f.navn.trim() + "(" + f.kode.trim() + ")")
                    .sort((a, b) => a.localeCompare(b))
                : []
            }
            register={register}
            setValue={setValue}
          />
          <RadioGroup
            legend="Status"
            name="attestertStatus"
            defaultValue={"false"}
          >
            <Radio value="true" {...register("attestertStatus")}>
              Attestert
            </Radio>
            <Radio value="false" {...register("attestertStatus")}>
              Ikke attestert
            </Radio>
            <Radio value="null" {...register("attestertStatus")}>
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
  );
}

export default SokForm;
