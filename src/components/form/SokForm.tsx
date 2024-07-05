import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ErrorSummary, Radio, RadioGroup } from "@navikt/ds-react";
import FormField from "./FormField";
import { SokeData, SokeSchema } from "./SokeSchema";

type SokFormProps = {
  onSubmit: (data: SokeData) => void;
};

function SokForm({ onSubmit }: SokFormProps) {
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
      <div className="grid col-auto">
        <h1 className="text-3xl font-bold mb-4">Søk attestasjoner</h1>
        <FormField
          placeholder="GjelderId"
          name="gjelderId"
          register={register}
          error={errors.gjelderId}
        />
        <FormField
          placeholder="fagsystemId"
          name="fagsystemId"
          register={register}
          error={errors.fagsystemId}
        />
        <FormField
          placeholder="kodeFaggruppe"
          name="kodeFaggruppe"
          register={register}
          error={errors.kodeFaggruppe}
        />
        <FormField
          placeholder="kodeFagomraade"
          name="kodeFagomraade"
          register={register}
          error={errors.kodeFagomraade}
        />
        <RadioGroup
          legend="Attestert status"
          name="attestertStatus"
          defaultValue={""}
        >
          <Radio value="true" {...register("attestertStatus")}>
            attestert
          </Radio>
          <Radio value="false" {...register("attestertStatus")}>
            ikke attestert
          </Radio>
          <Radio value="" {...register("attestertStatus")}>
            alle
          </Radio>
        </RadioGroup>
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
        <button type="submit" className="submit-button">
          Submit
        </button>
      </div>
    </form>
  );
}

export default SokForm;
