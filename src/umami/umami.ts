export const SOK = {
  SUBMIT: "søkeknapp trykket",
  GJELDERID: "søk med gjelderId",
  FAGSYSTEM: "søk med fagsystemid",
  FAGGRUPPE: "søk ikke attesterte i faggruppe",
  FAGOMRAADE: "søk ikke attesterte i fagområde",
  RESET: "søk resatt",
};

export const TREFFLISTE = {
  EMPTY: "treffliste tomt svar",
  ERROR: "treffliste feil",
};

export const DETALJER = {
  AAPNE_ALLE_RADER: "detaljer åpne alle rader trykket",
  OPPDATER_TRYKKET: "detaljer oppdater trykket",
  ATTESTERT: "detaljer attestering",
  AVATTESTERT: "detaljer avattestering",
  ERROR: "detaljer kall til zos feilet",
};

export function log(s: string): void {
  window.umami.track({ app: "attestasjon", event: s });
}
