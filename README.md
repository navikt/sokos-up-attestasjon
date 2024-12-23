# Attestasjon mikrofrontend

(Kort beskrivelse av applikasjonen)
</br>Mer dokumentasjon kan du finne under mappen [dokumentasjon](dokumentasjon)
</br>Backend til applikasjonen er [sokos-oppdrag](https://github.com/navikt/sokos-oppdrag)

## Miljøer

- [Q1-miljø](https://utbetalingsportalen.intern.dev.nav.no/attestasjon)

## Tilganger

### Hvordan få tilgang

For å få tilgang til selve skjermbildet (basistilgang):

- `0000-GA-SOKOS-MF-ATTESTASJON` (selve applikasjon i Utbetalingsportalen)

Tilgang fås ved ta kontakt med din identansvarlig. Det kan noen ganger være en strevsomt å få på plass tilganger
i identrutinene. Det er derfor viktig å benytte riktig begrep i kommunikasjon med dem.

### Beskrivelse av AD-grupper og hva de heter i identrutinen

| Navn Identrutinen                                             | AD-gruppe                                    | Beskrivelse                                                             |
| ------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------- |
| Utbetalingsportalen - attestasjon - Applikasjonstilgang       | 0000-GA-SOKOS-MF-Attestasjon                 | Basis tilgang                                                           |
| Utbetalingsportalen – attestasjon - lesetilgang - NØS         | 0000-GA-SOKOS-MF-Attestasjon-NØS-READ        | Lese tilgang for NØS                                                    |
| Utbetalingsportalen – attestasjon - lesetilgang - NØP         | 0000-GA-SOKOS-MF-Attestasjon-NØP-READ        | Lese tilgang for NØP                                                    |
| Utbetalingsportalen – attestasjon - lesetilgang – nasjonalt   | 0000-GA-SOKOS-MF-Attestasjon-nasjonalt-READ  | Lese tilgang for landekkende                                            |
| Utbetalingsportalen – attestasjon - skrivetilgang - NØS       | 0000-GA-SOKOS-MF-Attestasjon-NØS-WRITE       | Skrive tilgang for NØS                                                  |
| Utbetalingsportalen – attestasjon - skrivetilgang - NØP       | 0000-GA-SOKOS-MF-Attestasjon-NØP-WRITE       | Skrive tilgang for NØP                                                  |
| Utbetalingsportalen – attestasjon - skrivetilgang – nasjonalt | 0000-GA-SOKOS-MF-Attestasjon-nasjonalt-WRITE | Skrive tilgang for landekkende                                          |
| Økonomiportalen - Egne ansatte                                | 0000-GA-okonomi-egne_ansatte                 | Tilgang for å se egne ansatte                                           |
| Økonomiportalen - Fortrolig                                   | 0000-GA-okonomi-fortrolig                    | Tilgang for å se fortrolig, kode 6 (Adressebeskyttede personer)         |
| Økonomiportalen - Strengt fortrolig                           | 0000-GA-okonomi-strengt_fortrolig            | Tilgang for å se strengt fortrolig, kode 7 (Adressebeskyttede personer) |

## Kom i gang

1. Installere [Node.js](https://nodejs.dev/en/)
2. Installer [pnpm](https://pnpm.io/)
3. Installere dependencies `pnpm install`
4. Start appen lokalt `pnpm run dev` (Mock Service Worker) eller mot backend lokalt `pnpm run dev:backend` [sokos-oppdrag](https://github.com/navikt/sokos-oppdrag)
5. Appen nås på <http://localhost:5173/attestasjon>

NB! Anbefaler sette opp [ModHeader](https://modheader.com/) extension på Chrome for å sende med Obo-token i `Authorization` header når du kjører mot backend lokalt da den krever at token inneholder NavIdent.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på Github.
Interne henvendelser kan sendes via Slack i kanalen #po-utbetaling.
