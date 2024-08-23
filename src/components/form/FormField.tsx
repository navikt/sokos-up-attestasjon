import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { TextField } from "@navikt/ds-react";
import { SokeData, ValidFieldNames } from "./SokeSchema";

export type FormFieldProps = {
  name: ValidFieldNames;
  defaultValue?: string;
  register: UseFormRegister<SokeData>;
  error: FieldError | undefined;
  label: string;
  placeholder?: string;
};

const FormField: React.FC<FormFieldProps> = ({
  name,
  defaultValue,
  register,
  error,
  label,
  placeholder,
}) => {
  return (
    <>
      <TextField
        label={label}
        placeholder={placeholder}
        defaultValue={defaultValue}
        error={error?.message}
        id={name}
        {...register(name)}
      />
    </>
  );
};

export default FormField;
