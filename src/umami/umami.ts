export const EVENT_NAME = {
  AAPNE_ALLE_RADER: "åpne alle rader trykket",
  LINK: "link trykket",
  OPPDATER_TRYKKET: "oppdater trykket",
  REDIGERTE_DATO: "redigerte dato",
  RESET: "søk resatt",
  SORTER: "sortert",
  SUBMIT: "søkeknapp trykket",
  SUMMODAL: "summodal åpnet",
  VELG_ALLE: "velg alle trykket",
};

export function logUserEvent(name: string, data?: object): void {
  window?.umami?.track(name, data);
}
