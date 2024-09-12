import React from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { SokeData, ValidFieldNames } from "./SokeSchema";
import styles from "./SokosCombobox.module.css";

type FaggruppeComboboxProps = {
  name:
    | "gjelderId"
    | "fagsystemId"
    | "kodeFagGruppe"
    | "kodeFagOmraade"
    | "attestertStatus";
  faggrupper?: string[];
  label: string;
  register: UseFormRegister<SokeData>;
  setValue: UseFormSetValue<SokeData>;
};

const SokosCombobox = ({
  name,
  label,
  faggrupper,
  register,
  setValue,
}: FaggruppeComboboxProps) => {
  if (!faggrupper) return <></>;

  const isAValidFieldName = (s: string): s is ValidFieldNames =>
    s === "kodeFagGruppe" || s === "kodeFagOmraade";

  const mapToKode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    const transformedValue = selectedValue.split("(")[1].slice(0, -1);
    if (isAValidFieldName(event.target.name))
      setValue(event.target.name, transformedValue);
  };

  return (
    <>
      <label className={styles.combobox}>
        {<b>{label}</b>}
        <input
          className={styles.combobox__input}
          list={name}
          {...register(name, { required: true })}
          onChange={mapToKode}
        />
      </label>
      <datalist id={name}>
        {faggrupper.map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
    </>
  );
};

export default SokosCombobox;
