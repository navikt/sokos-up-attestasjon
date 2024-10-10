import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

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

export function isInvalidDateFormat(norskDato: string): boolean {
  dayjs.extend(customParseFormat);
  const oppgittDato = dayjs(norskDato, datoFormatNorsk, true);
  return !oppgittDato.isValid();
}

export function isDateInThePast(norskDato: string): boolean {
  dayjs.extend(customParseFormat);
  const oppgittDato = dayjs(norskDato, datoFormatNorsk, true);
  return oppgittDato.isBefore(dayjs().startOf("day"));
}
