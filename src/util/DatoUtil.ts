import dayjs from "dayjs";

const datoFormatNorsk = "DD.MM.YYYY";

export function isoDatoTilNorskDato(isoDato: string | undefined): string {
  if (!isoDato) {
    return "";
  }

  return dayjs(isoDato, "YYYY-MM-DD", true).format(datoFormatNorsk);
}

export function norskDatoTilIsoDato(norskDato?: string): string {
  return dayjs(norskDato, "DD.MM.YYYY", true).format("YYYY-MM-DD");
}

export function dagensDato(): string {
  return dayjs().format(datoFormatNorsk);
}
