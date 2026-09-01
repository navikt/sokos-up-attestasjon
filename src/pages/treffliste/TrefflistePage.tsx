import { Heading, Loader } from "@navikt/ds-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { hentNavn, hentOppdrag } from "../../api/apiService";
import AlertWithCloseButton from "../../components/AlertWithCloseButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import LabelText from "../../components/LabelText";
import NoRecordsFound from "../../components/NoRecordsFound";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import type { ErrorMessage } from "../../types/ErrorMessage";
import { SokeDataToSokeParameter } from "../../types/SokeParameter";
import { AttestertStatus } from "../../types/schema/AttestertStatus";
import { ROOT } from "../../util/routenames";
import ReloadButton from "./ReloadButton";
import TreffTabell from "./TreffTabell";

export default function TrefflistePage() {
	const {
		oppdragDtoList,
		sokeData,
		gjelderNavn,
		setGjelderNavn,
		setOppdragDtoList,
	} = useStore();
	const navigate = useNavigate();
	// Starter i "loading"-tilstand siden trefflisten alltid hentes på nytt fra
	// backend ved mount/refresh, og oppdragDtoList ikke lenger persisteres.
	const [isReloading, setIsReloading] = useState<boolean>(true);
	const [reloadError, setReloadError] = useState<ErrorMessage | null>(null);

	const reloadTreffliste = useCallback(() => {
		if (!sokeData) {
			return;
		}

		setIsReloading(true);
		setReloadError(null);

		const sokeParameter = SokeDataToSokeParameter.parse(sokeData);

		hentOppdrag(sokeParameter)
			.then((response) => {
				setOppdragDtoList(response);
			})
			.catch((error) => {
				setReloadError({
					variant: "error",
					message:
						error.message || "Klarte ikke å oppdatere trefflisten. Prøv igjen.",
				});
			})
			.finally(() => {
				setIsReloading(false);
			});
	}, [sokeData, setOppdragDtoList]);

	// Sikrer at trefflisten hentes på nytt fra backend når siden lastes/refreshes,
	// slik at man ikke viser en potensielt utdatert liste fra sessionStorage.
	useEffect(() => {
		reloadTreffliste();
	}, [reloadTreffliste]);

	function getAttestertStatusText() {
		if (
			sokeData?.alternativer === AttestertStatus.IKKE_FERDIG_ATTESTERT_EKSL_EGNE
		) {
			return "Ikke ferdig attestert eksl. egne";
		} else if (
			sokeData?.alternativer === AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE
		) {
			return "Ikke ferdig attestert inkl. egne";
		} else if (sokeData?.alternativer === AttestertStatus.ATTESTERT) {
			return "Attestert";
		} else if (sokeData?.alternativer === AttestertStatus.ALLE) {
			return "Alle";
		} else {
			return "Egne attesterte";
		}
	}

	// sokeData persisteres fortsatt (den beskriver hva søket gjelder), så denne
	// guarden fungerer likt som før også etter en nettleser-refresh: mangler
	// søkekriteriene, er det ikke noe grunnlag for å vise trefflisten.
	useEffect(() => {
		if (!sokeData) {
			navigate(ROOT, { replace: true });
		}
	}, [navigate, sokeData]);

	useEffect(() => {
		if (sokeData?.gjelderId !== "" && !gjelderNavn) {
			hentNavn({ gjelderId: sokeData?.gjelderId }).then((response) => {
				setGjelderNavn(response.navn);
			});
		}
	}, [gjelderNavn, setGjelderNavn, sokeData]);

	return (
		<div className={commonstyles.page}>
			<div className={commonstyles.page__top}>
				<Heading level="1" size="large" spacing>
					Attestasjon: Treffliste
				</Heading>
				<Breadcrumbs searchLink treffliste />
				<div className={commonstyles["page__top-sokekriterier"]}>
					<Heading size={"small"} level={"2"}>
						Søkekriterier benyttet:
					</Heading>
					<div className={commonstyles["page__top-sokekriterier__content"]}>
						<LabelText label={"Gjelder"} text={sokeData?.gjelderId} />
						<LabelText label={"Navn"} text={gjelderNavn} />
						<LabelText label={"Fagsystem id"} text={sokeData?.fagSystemId} />
						<LabelText label={"Faggruppe"} text={sokeData?.fagGruppe?.type} />
						<LabelText
							label={"Fagområde"}
							text={sokeData?.fagOmraade?.kodeFagomraade}
						/>
						<LabelText
							label={"Attestert status"}
							text={getAttestertStatusText()}
						/>
					</div>
					<div className={commonstyles["page__top-sokekriterier__footer"]}>
						<ReloadButton isLoading={isReloading} onClick={reloadTreffliste} />
					</div>
				</div>
				{!!reloadError && (
					<div className={commonstyles["page__top-alert"]}>
						<AlertWithCloseButton
							show={!!reloadError}
							setShow={() => setReloadError(null)}
							variant={reloadError.variant}
						>
							{reloadError.message}
						</AlertWithCloseButton>
					</div>
				)}
			</div>

			{isReloading && !oppdragDtoList && (
				<Loader size="2xlarge" title="Laster ..." variant="interaction" />
			)}
			{oppdragDtoList && <TreffTabell oppdragDtoList={oppdragDtoList} />}
			{oppdragDtoList && oppdragDtoList.length === 0 && !isReloading && (
				<NoRecordsFound buttonText="Gå tilbake til Søk" navigateTo="/" />
			)}
		</div>
	);
}
