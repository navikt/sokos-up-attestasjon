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

const Breadcrumbs = ({
  searchLink,
  treffliste,
  trefflistelink,
  detaljer,
  detaljerLink,
  oppdragsdetaljer,
}: BreadcrumbsProps) => {
  return (
    <div className={styles["breadcrumbs"]}>
      <div className={styles["breadcrumbs-left"]}>
        <div className={styles["breadcrumbs-contents"]}>
          {searchLink && (
            <div className={styles["breadcrumbs-crumb"]}>
              <Link to={"/"} className={commonstyles.link}>
                <BodyShort size="large">
                  <b>Søk</b>
                </BodyShort>
              </Link>
            </div>
          )}
          {treffliste && (
            <div className={styles["breadcrumbs-crumb"]}>
              <BodyShort size="large">
                <b>&gt; &gt; Treffliste</b>
              </BodyShort>
            </div>
          )}
          {trefflistelink && (
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
          {detaljer && (
            <div className={styles["breadcrumbs-crumb"]}>
              <BodyShort size="large">
                <b>&gt; &gt; Detaljer</b>
              </BodyShort>
            </div>
          )}
          {detaljerLink && (
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
          {oppdragsdetaljer && (
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
};
export default Breadcrumbs;
