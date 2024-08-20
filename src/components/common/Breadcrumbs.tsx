import { Link } from "react-router-dom";
import { BodyShort } from "@navikt/ds-react";
import styles from "./Breadcrumbs.module.css";
import NullstillButton from "./ResetButton";

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
    <div className={styles.breadcrumbs}>
      <div className={styles.breadcrumbs__left}>
        <div className={styles.breadcrumbs__contents}>
          {searchLink && (
            <div className={styles.breadcrumbs__crumb}>
              <Link to={"/"}>
                <BodyShort size="large">
                  <b>Søk</b>
                </BodyShort>
              </Link>
            </div>
          )}
          {treffliste && (
            <div className={styles.breadcrumbs__crumb}>
              <BodyShort size="large">
                <b>&gt; &gt; Treffliste</b>
              </BodyShort>
            </div>
          )}
          {trefflistelink && (
            <div className={styles.breadcrumbs__crumb}>
              <BodyShort size="large">
                <b>
                  &gt; &gt; <Link to={"/treffliste"}>Treffliste</Link>
                </b>
              </BodyShort>
            </div>
          )}
          {detaljer && (
            <div className={styles.breadcrumbs__crumb}>
              <BodyShort size="large">
                <b>&gt; &gt; Detaljer</b>
              </BodyShort>
            </div>
          )}
          {detaljerLink && (
            <div className={styles.breadcrumbs__crumb}>
              <BodyShort size="large">
                <b>
                  &gt; &gt; <Link to={"/detaljer"}>Detaljer</Link>
                </b>
              </BodyShort>
            </div>
          )}
          {oppdragsdetaljer && (
            <div className={styles.breadcrumbs__crumb}>&gt; &gt; Detaljer</div>
          )}
        </div>
      </div>
      <div className={styles.breadcrumbs__right}>
        <NullstillButton />
      </div>
    </div>
  );
};
export default Breadcrumbs;
