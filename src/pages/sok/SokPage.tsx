import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Alert, Heading } from "@navikt/ds-react";
import { hentOppdrag } from "../../api/apiService";
import { useStore } from "../../store/AppState";
import commonStyles from "../../styles/common-styles.module.css";
import { ErrorMessage } from "../../types/ErrorMessage";
import { SokeData } from "../../types/SokeData";
import { SokeDataToSokeParameter } from "../../types/SokeParameter";
import { AttestertStatus } from "../../types/schema/AttestertStatus";
import { SokeDataSchema } from "../../types/schema/SokeDataSchema";
import { SOK, logUserEvent } from "../../umami/umami";
import { isEmpty } from "../../util/commonUtils";
import FaggruppeCombobox from "./FaggruppeCombobox";
import FagomraadeCombobox from "./FagomraadeCombobox";
import FagsystemIdTextField from "./FagsystemIdTextField";
import GjelderIdTextField from "./GjelderIdTextField";
import ResetButton from "./ResetButton";
import SokButton from "./SokButton";
import SokFormFeilmeldinger from "./SokFormFeilmeldinger";
import styles from "./SokPage.module.css";
import SokPageHelpText from "./SokPageHelpText";
import StatuserRadioButtons from "./StatuserRadioButtons";

export default function SokPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setSokeData, sokeData, setOppdragDtoList, resetState } = useStore();

  const form = useForm<SokeData>({
    resolver: zodResolver(SokeDataSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      gjelderId: "",
      fagSystemId: "",
      fagGruppe: undefined,
      fagOmraade: undefined,
      alternativer: AttestertStatus.IKKE_FERDIG_ATTESTERT_INKL_EGNE,
    },
  });

  const { handleSubmit, setValue } = form;

  useEffect(() => {
    if (sokeData) {
      setValue("gjelderId", sokeData.gjelderId);
      setValue("fagSystemId", sokeData.fagSystemId);
      setValue("fagGruppe", sokeData.fagGruppe);
      setValue("fagOmraade", sokeData.fagOmraade);
      setValue("alternativer", sokeData.alternativer);
    }
  }, [setValue, sokeData]);

  function onSubmit(sokeData: SokeData) {
    resetState();
    setSokeData(sokeData);
    setIsLoading(true);
    setError(null);

    const sokeParameter = SokeDataToSokeParameter.parse(sokeData);

    const isFnr =
      !!sokeData?.gjelderId && /^(?!00)\d{11}$/.test(sokeData?.gjelderId);
    const isOrgnr =
      !!sokeData?.gjelderId && /^(00\d{9}|\d{9})$/.test(sokeData?.gjelderId);

    logUserEvent(SOK.SUBMIT, {
      fnr: isFnr,
      orgnr: isOrgnr,
      fagsystemid: !!sokeData?.fagSystemId,
      faggruppe: sokeData?.fagGruppe?.type,
      fagomraade: sokeData?.fagOmraade?.kodeFagomraade,
      attestert: sokeData?.alternativer,
    });

    hentOppdrag(sokeParameter)
      .then((response) => {
        setIsLoading(false);
        setError(null);
        if (!isEmpty(response)) {
          setOppdragDtoList(response);
          navigate("/treffliste", { replace: false });
        } else {
          setError({
            variant: "info",
            message:
              "Ingen treff på søket. Prøv igjen med andre søkekriterier.",
          });
        }
      })
      .catch((error) => {
        setError({
          variant: error.statusCode == 400 ? "warning" : "error",
          message: error.message,
        });
        setIsLoading(false);
      });
  }

  const Divider = () => <div className={styles["sok__divider"]} />;

  return (
    <>
      <div className={commonStyles["page__heading"]}>
        <Heading level="1" size="large" spacing>
          Attestasjon: Søk
        </Heading>
      </div>
      <div className={styles["sok"]}>
        <SokPageHelpText />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormProvider {...form}>
            <div className={styles["sok__form"]}>
              <div className={styles["sok__input-fields"]}>
                <GjelderIdTextField />
                <FagsystemIdTextField />
                <FaggruppeCombobox />
                <FagomraadeCombobox />
              </div>
              <Divider />
              <StatuserRadioButtons />
            </div>
            <SokFormFeilmeldinger />
            <div className={styles["sok__submit-wrapper"]}>
              <ResetButton clearError={() => setError(null)} />
              <SokButton isLoading={isLoading} />
            </div>
          </FormProvider>
        </form>
      </div>
      {error && (
        <div className={styles["sok__error"]}>
          <Alert variant={error.variant} role="status">
            {error.message}
          </Alert>
        </div>
      )}
    </>
  );
}
