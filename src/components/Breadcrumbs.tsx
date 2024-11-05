import { Link } from "react-router-dom";
import { BodyShort } from "@navikt/ds-react";
import commonstyles from "../styles/common-styles.module.css";
import styles from "./Breadcrumbs.module.css";
import ResetButton from "./ResetButton";

type BreadcrumbsProps = {
  searchLink?: boolean;
  treffliste?: boolean;
  trefflistelink?: boolean;
  detaljer?: boolean;
  detaljerLink?: boolean;
  oppdragsdetaljer?: boolean;
};

export default function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <div className={styles["breadcrumbs"]}>
      <div className={styles["breadcrumbs-left"]}>
        <div className={styles["breadcrumbs-contents"]}>
          {props.searchLink && (
            <div className={styles["breadcrumbs-crumb"]}>
              <Link to={"/"} className={commonstyles.link}>
                <BodyShort size="large">
                  <b>Gjeldende Søk</b>
                </BodyShort>
              </Link>
            </div>
          )}
          {props.treffliste && (
            <div className={styles["breadcrumbs-crumb"]}>
              <BodyShort size="large">
                <b>&gt; &gt; Treffliste</b>
              </BodyShort>
            </div>
          )}
          {props.trefflistelink && (
            <div className={styles["breadcrumbs-crumb"]}>
              <BodyShort size="large">
                <b>
                  &gt; &gt;{" "}
                  <Link to={"/treffliste"} className={commonstyles.link}>
                    Treffliste
                  </Link>
                </b>
              </BodyShort>
            </div>
          )}
          {props.detaljer && (
            <div className={styles["breadcrumbs-crumb"]}>
              <BodyShort size="large">
                <b>&gt; &gt; Detaljer</b>
              </BodyShort>
            </div>
          )}
          {props.detaljerLink && (
            <div className={styles["breadcrumbs-crumb"]}>
              <BodyShort size="large">
                <b>
                  &gt; &gt;{" "}
                  <Link to={"/detaljer"} className={commonstyles.link}>
                    Detaljer
                  </Link>
                </b>
              </BodyShort>
            </div>
          )}
          {props.oppdragsdetaljer && (
            <div className={styles["breadcrumbs-crumb"]}>
              &gt; &gt; Detaljer
            </div>
          )}
        </div>
      </div>
      <div className={styles["breadcrumbs-right"]}>
        <ResetButton />
      </div>
    </div>
  );
}
