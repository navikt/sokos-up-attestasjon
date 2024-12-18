export const SOK = {
  SUBMIT: "søkeknapp trykket",
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
  AAPNE_ALLE_RADER: "åpne alle rader trykket",
  OPPDATER_TRYKKET: "oppdater trykket",
  REDIGERTE_DATO: "redigerte dato",
};

export function logUserEvent(s: string, data?: object): void {
  window?.umami?.track(s, data);
}
