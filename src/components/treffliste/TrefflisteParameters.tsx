import LabelText from "../common/LabelText";
import styles from "./TrefflisteParameters.module.css";

type SokekriterierProps = {
  gjelderId?: string;
};

const TrefflisteParameters = ({ gjelderId }: SokekriterierProps) => {
  return (
    <>
      <div className={styles.sokekriterier}>
        <div className={styles.sokekriterier__content}>
          <LabelText label={"Gjelder ID"} text={gjelderId ?? ""} />
        </div>
      </div>
    </>
  );
};
export default TrefflisteParameters;
