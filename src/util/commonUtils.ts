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
