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
  SUMMODAL: "summodal åpnet",
  VELG_ALLE: "velg alle trykket",
};

const attestert = {
  "1": "Ikke ferdig attestert eksl. egne",
  "2": "Ikke ferdig attestert inkl. egne",
  "3": "Attestert",
  "4": "Alle",
  "5": "Egne attesterte",
};

export function attestertStatusText(
  alternativer?: "1" | "2" | "3" | "4" | "5",
): string {
  if (!alternativer) {
    // burde ikke være mulig
    return "";
  }
  return attestert[alternativer];
}

export function logUserEvent(name: string, data?: object): void {
  window?.umami?.track(name, data);
}
