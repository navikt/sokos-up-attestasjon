import { ChevronRightDoubleIcon } from "@navikt/aksel-icons";
import { BodyShort } from "@navikt/ds-react";
import { Link } from "react-router";
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
		<nav className={styles.breadcrumbs} aria-label="Brødsmulesti">
			<div className={styles.breadcrumbs__left}>
				<div className={styles.breadcrumbs__contents}>
					{props.searchLink && (
						<BodyShort size="large">
							<Link to="/" replace className={commonstyles.link}>
								Gjeldende Søk
							</Link>
						</BodyShort>
					)}
					{props.treffliste && (
						<>
							<ChevronRightDoubleIcon aria-hidden />
							<BodyShort size="large">Treffliste</BodyShort>
						</>
					)}
					{props.trefflistelink && (
						<>
							<ChevronRightDoubleIcon aria-hidden />
							<BodyShort size="large">
								<Link to="/treffliste" replace className={commonstyles.link}>
									Treffliste
								</Link>
							</BodyShort>
						</>
					)}
					{props.detaljer && (
						<>
							<ChevronRightDoubleIcon aria-hidden />
							<BodyShort size="large">Detaljer</BodyShort>
						</>
					)}
					{props.detaljerLink && (
						<>
							<ChevronRightDoubleIcon aria-hidden />
							<BodyShort size="large">
								<Link to="/detaljer" replace className={commonstyles.link}>
									Detaljer
								</Link>
							</BodyShort>
						</>
					)}
					{props.oppdragsdetaljer && (
						<>
							<ChevronRightDoubleIcon aria-hidden />
							Detaljer
						</>
					)}
				</div>
			</div>
			<div className={styles.breadcrumbs__right}>
				<ResetButton />
			</div>
		</nav>
	);
}
