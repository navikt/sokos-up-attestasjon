import { UseFormRegister } from "react-hook-form";
import { SokeData } from "./SokeSchema";
import styles from "./SokosCombobox.module.css";

type FaggruppeComboboxProps = {
  name:
    | "gjelderId"
    | "fagsystemId"
    | "kodeFaggruppe"
    | "kodeFagomraade"
    | "attestertStatus";
  faggrupper?: string[];
  register: UseFormRegister<SokeData>;
  handleClick: () => void;
};

const SokosCombobox = ({
  name,
  faggrupper,
  register,
  handleClick,
}: FaggruppeComboboxProps) => {
  if (!faggrupper) return <></>;
  return (
    <>
      <label className={styles.combobox}>
        Faggruppe:
        <input
          className={styles.combobox__input}
          list={name}
          {...register(name, { required: true })}
          onClick={handleClick}
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
