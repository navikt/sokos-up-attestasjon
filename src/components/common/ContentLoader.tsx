import { Loader } from "@navikt/ds-react";
import commonstyles from "../../styles/common-styles.module.css";

export default function ContentLoader() {
  return (
    <div className={commonstyles.contentloader}>
      <Loader size="2xlarge" title="Laster ..." variant="interaction" />
    </div>
  );
}
