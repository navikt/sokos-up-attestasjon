import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@navikt/aksel-icons";
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
    <div role="navigation" className={styles["breadcrumbs"]}>
      <div className={styles["breadcrumbs-left"]}>
        <div className={styles["breadcrumbs-contents"]}>
          {props.searchLink && (
            <div className={styles["breadcrumbs-crumb"]}>
              <Link to={"/"} className={commonstyles.link}>
                <BodyShort size="large">Gjeldende Søk</BodyShort>
              </Link>
            </div>
          )}
          {props.treffliste && (
            <div className={styles["breadcrumbs-crumb"]}>
              <ChevronRightIcon focusable={"false"} title="Pil høyre" />
              <BodyShort size="large">Treffliste</BodyShort>
            </div>
          )}
          {props.trefflistelink && (
            <div className={styles["breadcrumbs-crumb"]}>
              <ChevronRightIcon focusable={"false"} title="Pil høyre" />
              <BodyShort size="large">
                <Link to={"/treffliste"} className={commonstyles.link}>
                  Treffliste
                </Link>
              </BodyShort>
            </div>
          )}
          {props.detaljer && (
            <div className={styles["breadcrumbs-crumb"]}>
              <ChevronRightIcon title="Chevron ikon" />
              <BodyShort size="large">Detaljer</BodyShort>
            </div>
          )}
          {props.detaljerLink && (
            <div className={styles["breadcrumbs-crumb"]}>
              <ChevronRightIcon title="Pil høyre" />
              <BodyShort size="large">
                <Link to={"/detaljer"} className={commonstyles.link}>
                  Detaljer
                </Link>
              </BodyShort>
            </div>
          )}
          {props.oppdragsdetaljer && (
            <div className={styles["breadcrumbs-crumb"]}>
              <ChevronRightIcon title="Pil høyre" />
              Detaljer
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
