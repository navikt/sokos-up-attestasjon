import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useSWRConfig } from "swr";
import { Heading } from "@navikt/ds-react";
import SokForm from "../components/form/SokForm";
import { SokeData } from "../components/form/SokeSchema";
import { TreffTabell } from "../components/treffliste/TreffTabell";
import RestService from "../services/rest-service";
import commonstyles from "../util/common-styles.module.css";
import { retrieveSok, storeSok } from "../util/commonUtils";
import styles from "./SokPage.module.css";

export default function SokPage() {
  const { mutate } = useSWRConfig();
  const [sokedata, setSokedata] = useState<SokeData | undefined>(retrieveSok);
  const { treffliste, isLoading } =
    RestService.useFetchTreffliste(retrieveSok());

  const handleChangeSok: SubmitHandler<SokeData> = (sokedata) => {
    storeSok(sokedata);
    setSokedata(sokedata);
  };

  useEffect(() => {
    mutate("/sok", []);
  }, [sokedata, mutate]);

  return (
    <>
      <div className={commonstyles.pageheading}>
        <Heading level="1" size="large" spacing>
          Attestasjon
        </Heading>
      </div>
      <div className={styles.sok_sok}>
        <Heading level="2" size="medium" spacing>
          Søk
        </Heading>
        <SokForm sokedata={sokedata} onSubmit={handleChangeSok} />
      </div>
      {!isLoading && treffliste && (
        <div className={styles.treffliste__trefftabell}>
          <TreffTabell treffliste={treffliste} />
        </div>
      )}
    </>
  );
}
