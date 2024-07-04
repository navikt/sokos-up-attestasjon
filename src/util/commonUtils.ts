import { AttestasjonTreff } from "../models/AttestasjonTreff";

const attestasjonItemName = "attestasjon_gId";

export const storeId = (id?: string) =>
  id
    ? sessionStorage.setItem(attestasjonItemName, btoa(id))
    : sessionStorage.removeItem(attestasjonItemName);

export const retrieveId = () => retrieveFromStorage(attestasjonItemName) ?? "";

export const clearId = () => storeId();

export const retrieveFromStorage = (key: string) => {
  const storedCoded = sessionStorage.getItem(key);
  if (storedCoded === null) return null;
  else return atob(storedCoded);
};

export const isEmpty = (array: Array<unknown> | undefined | null) =>
  !array || !Array.isArray(array) || !array.length;

export const firstOf = <T>(ar: Array<T>) => ar.reduce((a) => a);

export const anyOppdragExists = (
  treffliste?: AttestasjonTreff[],
): treffliste is AttestasjonTreff[] => {
  if (!treffliste) return false;
  if (!Array.isArray(treffliste) || isEmpty(treffliste)) return false;
  //const oppdragsliste = treffliste.flatMap((t) => t.oppdragsListe);
  if (isEmpty(treffliste)) return false;
  return true;
};
