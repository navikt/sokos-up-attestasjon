import { SokeData } from "../components/form/SokeSchema";
import { AttestasjonTreff } from "../models/AttestasjonTreff";

const attestasjonItemName = "attestasjon_gId";

export const retrieveSok = () => {
  const data$ = retrieveFromStorage(attestasjonItemName);
  if (data$) return JSON.parse(data$) as SokeData;
  else return undefined;
};

export const clearSok = () => storeSok();

export const retrieveFromStorage = (key: string) => {
  const storedCoded = sessionStorage.getItem(key);
  if (storedCoded === null) return undefined;
  else return atob(storedCoded);
};

export const storeSok = (sokedata?: SokeData) => {
  sokedata
    ? sessionStorage.setItem(
        attestasjonItemName,
        btoa(JSON.stringify(sokedata)),
      )
    : sessionStorage.removeItem(attestasjonItemName);
};

export const isEmpty = (array: Array<unknown> | undefined | null) =>
  !array || !Array.isArray(array) || !array.length;

export const firstOf = <T>(ar: Array<T>) => ar.reduce((a) => a);

export const anyOppdragExists = (
  treffliste?: AttestasjonTreff[],
): treffliste is AttestasjonTreff[] => {
  return !(!treffliste || !Array.isArray(treffliste) || isEmpty(treffliste));
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
