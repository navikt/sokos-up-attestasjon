import { FieldError, UseFormRegister } from "react-hook-form";
import { TextField } from "@navikt/ds-react";
import { SokeData, ValidFieldNames } from "./SokeSchema";

export type FormFieldProps = {
  name: ValidFieldNames;
  defaultValue?: string;
  register: UseFormRegister<SokeData>;
  error: FieldError | undefined;
};

const FormField: React.FC<FormFieldProps> = ({
  name,
  defaultValue,
  register,
  error,
}) => {
  return (
    <>
      <TextField
        label={name}
        defaultValue={defaultValue}
        placeholder={name}
        error={error?.message}
        id={name}
        {...register(name)}
      />
    </>
  );
};

export default FormField;
