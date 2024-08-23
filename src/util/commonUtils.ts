import { SokeData } from "../components/form/SokeSchema";

const attestasjonItemName = "attestasjon_sok";

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
  if (sokedata) {
    sessionStorage.setItem(attestasjonItemName, btoa(JSON.stringify(sokedata)));
  } else {
    sessionStorage.removeItem(attestasjonItemName);
  }
};

export const storeId = (id?: string) =>
  id
    ? sessionStorage.setItem("attestasjon_gId", btoa(id))
    : sessionStorage.removeItem("attestasjon_gId");
export const retrieveId = () => retrieveFromStorage("attestasjon_gId") ?? "";
export const clearId = () => storeId();

export const isEmpty = (array: Array<unknown> | undefined | null) =>
  !array || !Array.isArray(array) || !array.length;
