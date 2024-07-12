import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, ErrorSummary, Radio, RadioGroup } from "@navikt/ds-react";
import useFetchFaggrupper from "../../services/hooks/useFetchFaggrupper";
import useFetchFagomraader from "../../services/hooks/useFetchFagomraader";
import FormField from "./FormField";
import styles from "./SokForm.module.css";
import { SokeData, SokeSchema } from "./SokeSchema";
import SokosCombobox from "./SokosCombobox";

type SokFormProps = {
  sokedata: SokeData | undefined;
  onSubmit: (data: SokeData) => void;
};

function SokForm({ sokedata, onSubmit }: SokFormProps) {
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
            defaultValue={sokedata?.gjelderId}
            register={register}
            error={errors.gjelderId}
          />
          <FormField
            name="fagsystemId"
            defaultValue={sokedata?.fagsystemId}
            register={register}
            error={errors.fagsystemId}
          />
          <SokosCombobox
            name="kodeFaggruppe"
            faggrupper={
              faggrupper
                ? faggrupper.map(
                    (f) => f.navn.trim() + "(" + f.type.trim() + ")",
                  )
                : []
            }
            register={register}
            setValue={setValue}
          />
          <SokosCombobox
            name="kodeFagomraade"
            faggrupper={
              fagomraader
                ? fagomraader.map(
                    (f) => f.navn.trim() + "(" + f.kode.trim() + ")",
                  )
                : []
            }
            register={register}
            setValue={setValue}
          />
          <RadioGroup
            legend="Attestert status"
            name="attestertStatus"
            defaultValue={sokedata?.attestertStatus ?? "null"}
          >
            <Radio value="true" {...register("attestertStatus")}>
              attestert
            </Radio>
            <Radio value="false" {...register("attestertStatus")}>
              ikke attestert
            </Radio>
            <Radio value="null" {...register("attestertStatus")}>
              alle
            </Radio>
          </RadioGroup>
        </div>
        {filteredErrors.length > 0 && (
          <ErrorSummary
            heading={"Du må fikse disse feilene før du kan fortsette"}
          >
            {filteredErrors.map((e) => (
              <ErrorSummary.Item key={e}>
                {(errors as { [key: string]: { message: string } })[e].message}
              </ErrorSummary.Item>
            ))}
          </ErrorSummary>
        )}
        <Button type="submit">Søk</Button>
      </form>
    </>
  );
}

export default SokForm;
