import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, ErrorSummary, Radio, RadioGroup } from "@navikt/ds-react";
import FormField from "./FormField";
import styles from "./SokForm.module.css";
import { SokeData, SokeSchema } from "./SokeSchema";

type SokFormProps = {
  sokedata: SokeData | undefined;
  onSubmit: (data: SokeData) => void;
};

function SokForm({ sokedata, onSubmit }: SokFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SokeData>({
    resolver: zodResolver(SokeSchema),
  });

  const filteredErrors = [...Object.keys(errors)].filter((m) => m);

  return (
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
        <FormField
          name="kodeFaggruppe"
          defaultValue={sokedata?.kodeFaggruppe}
          register={register}
          error={errors.kodeFaggruppe}
        />
        <FormField
          name="kodeFagomraade"
          defaultValue={sokedata?.kodeFagomraade}
          register={register}
          error={errors.kodeFagomraade}
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
            <ErrorSummary.Item>
              {(errors as { [key: string]: { message: string } })[e].message}
            </ErrorSummary.Item>
          ))}
        </ErrorSummary>
      )}
      <Button type="submit">Søk</Button>
    </form>
  );
}

export default SokForm;
