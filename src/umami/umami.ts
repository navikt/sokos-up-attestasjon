import { SokeData } from "../types/SokeData";

export const SOK = {
  VALIDATE: "søkeknapp trykket",
  SUBMIT: "søk utført",
  RESET: "søk resatt",
};

export const BREADCRUMBS = {
  LINK: "link trykket",
  RESET: "søk resatt",
};

export const TREFFLISTE = {
  SORTER: "sortert",
};

export const DETALJER = {
  EXPAND_ALL_ROWS_CLICKED: "åpne alle rader trykket",
  UPDATE_CLICKED: "oppdater trykket",
  EDITED_DATE: "redigerte dato",
  SUM_MODAL_OPENED: "summodal åpnet",
  SELECT_ALL_CHECKBOX_CLICKED: "velg alle trykket",
};

export function logUserEvent(name: string, data?: object): void {
  window?.umami?.track(name, data);
}

export function logSearchEvent(sokeData: SokeData) {
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
}
