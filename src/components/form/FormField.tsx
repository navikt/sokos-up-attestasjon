import { TextField } from "@navikt/ds-react";
import { FormFieldProps } from "./SokeSchema";

const FormField: React.FC<FormFieldProps> = ({
  placeholder,
  name,
  register,
  error,
}) => {
  return (
    <>
      <TextField
        label={name}
        placeholder={placeholder}
        error={error?.message}
        {...register(name)}
      />
    </>
  );
};

export default FormField;
