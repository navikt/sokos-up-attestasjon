import { Link } from "react-router-dom";
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
              <Link to={"/"}>Søk</Link>
            </div>
          )}
          {treffliste && (
            <div className={styles.breadcrumbs__crumb}>
              &gt; &gt; Treffliste
            </div>
          )}
          {trefflistelink && (
            <div className={styles.breadcrumbs__crumb}>
              &gt; &gt; <Link to={"/treffliste"}>Treffliste</Link>
            </div>
          )}
          {detaljer && (
            <div className={styles.breadcrumbs__crumb}>&gt; &gt; Detaljer</div>
          )}
          {detaljerLink && (
            <div className={styles.breadcrumbs__crumb}>
              &gt; &gt; <Link to={"/detaljer"}>Oppdrag</Link>
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
