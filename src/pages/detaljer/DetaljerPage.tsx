import { Heading, Loader } from "@navikt/ds-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
	attesterOppdragRequest,
	hentOppdrag,
	oppdaterAttestasjon,
	useFetchOppdragsdetaljer,
} from "../../api/apiService";
import AlertWithCloseButton from "../../components/AlertWithCloseButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import LabelText from "../../components/LabelText";
import NoRecordsFound from "../../components/NoRecordsFound";
import ReloadButton, { type ReloadStatus } from "../../components/ReloadButton";
import { useStore } from "../../store/AppState";
import commonstyles from "../../styles/common-styles.module.css";
import type { AttestasjonlinjeList } from "../../types/Attestasjonlinje";
import type { ErrorMessage } from "../../types/ErrorMessage";
import type { OppdragsDetaljerDTO } from "../../types/OppdragsDetaljerDTO";
import { SokeDataToSokeParameter } from "../../types/SokeParameter";
import { AttestertStatus } from "../../types/schema/AttestertStatus";
import { DETALJER } from "../../umami/umami";
import { formaterSistOppdatert } from "../../util/datoUtil";
import { ROOT } from "../../util/routenames";
import DetaljerTabell from "./DetaljerTabell";

export default function DetaljerPage() {
	const navigate = useNavigate();
	const { oppdragDto, sokeData, setOppdragDtoList } = useStore();

	const antallAttestanter = oppdragDto?.antAttestanter ?? 1;
	const [alertMessage, setAlertMessage] = useState<{
		message: string;
		variant: "success" | "error" | "warning";
	} | null>(null);
	const [isZosLoading, setIsZosLoading] = useState<boolean>(false);
	// Statusikonet gjelder kun manuelle klikk på "Last inn på nytt". Den
	// automatiske hentingen ved mount skal ikke gi hake eller kryss.
	const [reloadStatus, setReloadStatus] = useState<ReloadStatus>("idle");
	const [reloadError, setReloadError] = useState<ErrorMessage | null>(null);
	// Settes kun ved vellykket henting, slik at tidspunktet alltid beskriver de
	// oppdragslinjene som faktisk vises.
	const [sistOppdatert, setSistOppdatert] = useState<Date | null>(null);

	const { data, isLoading, isValidating, mutate } = useFetchOppdragsdetaljer(
		oppdragDto?.oppdragsId,
	);

	const hentOppdragsdetaljer = useCallback(
		(erManuell: boolean) => {
			setReloadError(null);
			setReloadStatus("idle");

			mutate()
				.then(() => {
					setSistOppdatert(new Date());
					if (erManuell) {
						setReloadStatus("success");
					}
				})
				.catch((error) => {
					setReloadError({
						variant: "error",
						message:
							error.message ||
							"Klarte ikke å oppdatere oppdragslinjene. Prøv igjen.",
					});
					if (erManuell) {
						setReloadStatus("error");
					}
				});
		},
		[mutate],
	);

	const linjerSomSkalVises: OppdragsDetaljerDTO | undefined = {
		...data,
		saksbehandlerIdent: data?.saksbehandlerIdent ?? "",
		oppdragsLinjeList:
			data?.oppdragsLinjeList.filter((linje) => {
				if (sokeData && sokeData.alternativer === AttestertStatus.ATTESTERT) {
					return linje.oppdragsLinje.attestert;
				} else if (
					sokeData &&
					[
						AttestertStatus.IKKE_FERDIG_ATTESTERT_EKSL_EGNE,
						AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE,
					].includes(sokeData.alternativer)
				) {
					return !linje.oppdragsLinje.attestert;
				} // Hvis man har valgt EGNE_ATTESTERTE eller ALLE skal alle rader vises
				else return true;
			}) ?? [],
	};

	useEffect(() => {
		if (!oppdragDto) {
			navigate(ROOT, { replace: true });
		}
	}, [navigate, oppdragDto]);

	// Oppdragslinjene hentes fra backend hver gang siden monteres, slik at
	// saksbehandler ikke ser en utdatert attestert-status fra en tidligere
	// visning av det samme oppdraget.
	useEffect(() => {
		hentOppdragsdetaljer(false);
	}, [hentOppdragsdetaljer]);

	async function handleSubmit(attestasjonlinjer: AttestasjonlinjeList) {
		if (
			attestasjonlinjer.filter(
				(attestasjonlinje) => !!attestasjonlinje.properties.dateError,
			).length > 0
		) {
			setAlertMessage({
				message: "Du må rette feil i datoformat før du kan oppdatere",
				variant: "error",
			});
			return;
		}

		if (
			attestasjonlinjer.filter(
				(linje) => linje.properties.fjern || linje.properties.attester,
			).length === 0
		) {
			setAlertMessage({
				message: "Du må velge minst en linje før du kan oppdatere",
				variant: "error",
			});
			return;
		}

		const request = attesterOppdragRequest(
			oppdragDto?.fagSystemId ?? "",
			oppdragDto?.kodeFagomraade ?? "",
			oppdragDto?.oppdragGjelderId ?? "",
			oppdragDto?.oppdragsId ?? 0,
			attestasjonlinjer,
		);

		setIsZosLoading(true);

		try {
			await oppdaterAttestasjon(request)
				.then((response) => {
					setAlertMessage({
						message: response.successMessage || "",
						variant: "success",
					});

					hentOppdragsdetaljer(false);
				})
				.catch((error) => {
					setAlertMessage({ message: error.message, variant: "error" });
				});

			const sokeParameter = SokeDataToSokeParameter.parse(sokeData);
			await hentOppdrag(sokeParameter).then((res) => setOppdragDtoList(res));
		} finally {
			if (!isLoading) {
				setIsZosLoading(false);
			}
		}
	}

	return (
		<div className={commonstyles.page}>
			<div className={commonstyles.page__top}>
				<Heading level="1" size="large" spacing>
					Attestasjon: Detaljer
				</Heading>
				<Breadcrumbs searchLink trefflistelink detaljer />
				{oppdragDto && (
					<div className={commonstyles["page__top-sokekriterier"]}>
						<Heading size={"small"} level={"2"}>
							Søkekriterier benyttet:
						</Heading>
						<div className={commonstyles["page__top-sokekriterier__content"]}>
							<LabelText label="Gjelder" text={oppdragDto.oppdragGjelderId} />
							<LabelText label="Fagsystem id" text={oppdragDto.fagSystemId} />
							<LabelText label="Ansvarssted" text={oppdragDto.ansvarssted} />
							<LabelText label="Kostnadssted" text={oppdragDto.kostnadssted} />
							<LabelText
								label="Fagområde"
								text={
									`${oppdragDto.kodeFagomraade}` +
									` (${oppdragDto.navnFagomraade})`
								}
							/>
							<LabelText label="Bilagstype" text={oppdragDto.typeBilag} />
						</div>
						<div className={commonstyles["page__top-sokekriterier__footer"]}>
							<ReloadButton
								isLoading={isValidating}
								status={reloadStatus}
								lastUpdatedText={
									sistOppdatert
										? `Sist oppdatert ${formaterSistOppdatert(sistOppdatert)}`
										: undefined
								}
								umamiEvent={DETALJER.RELOAD}
								onClick={() => hentOppdragsdetaljer(true)}
							/>
						</div>
					</div>
				)}
			</div>
			{isLoading && (
				<Loader size="2xlarge" title="Laster ..." variant="interaction" />
			)}
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
			{!!alertMessage && (
				<AlertWithCloseButton
					show={!!alertMessage}
					setShow={() => setAlertMessage(null)}
					variant={alertMessage.variant}
				>
					{alertMessage.message}
				</AlertWithCloseButton>
			)}
			{linjerSomSkalVises && (
				<DetaljerTabell
					antallAttestanter={antallAttestanter}
					handleSubmit={handleSubmit}
					isLoading={isLoading || isZosLoading}
					oppdragsDetaljer={linjerSomSkalVises}
					disable={linjerSomSkalVises.oppdragsLinjeList.length === 0}
				/>
			)}
			{linjerSomSkalVises &&
				linjerSomSkalVises.oppdragsLinjeList.length === 0 &&
				!isLoading && (
					<NoRecordsFound
						buttonText="Gå tilbake til Treffliste"
						navigateTo="/treffliste"
					/>
				)}
		</div>
	);
}
