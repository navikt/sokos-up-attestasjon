import { zodResolver } from "@hookform/resolvers/zod";
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
import FormField from "./FormField";
import styles from "./SokForm.module.css";
import { SokeData, SokeSchema } from "./SokeSchema";
import SokosCombobox from "./SokosCombobox";

type SokFormProps = {
  sokedata: SokeData | undefined;
  loading?: boolean;
  onSubmit: (data: SokeData) => void;
};

function SokForm({ sokedata, loading, onSubmit }: SokFormProps) {
  const { data: faggrupper } = useFetchFaggrupper();
  const { data: fagomraader } = useFetchFagomraader();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SokeData>({
    resolver: zodResolver(SokeSchema),
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
            register={register}
            error={errors.gjelderId}
          />
          <FormField
            name="fagsystemId"
            label="Fagsystem ID"
            defaultValue={sokedata?.fagsystemId}
            register={register}
            error={errors.fagsystemId}
          />
          <SokosCombobox
            name="kodeFaggruppe"
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
            name="kodeFagomraade"
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
            defaultValue={sokedata?.attestertStatus ?? "null"}
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
          <div className={styles.error_summary}>
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
        <div className={styles.sok__button}>
          <Button
            type="submit"
            icon={
              loading ? <Loader title={"Søker..."} /> : <MagnifyingGlassIcon />
            }
            iconPosition="right"
          >
            {loading ? "Søker..." : "Søk"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default SokForm;
