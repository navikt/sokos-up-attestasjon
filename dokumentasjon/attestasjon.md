# Attestasjon

## Validering av Søk

```mermaid
flowchart LR
   vedtaksdato["vedtaksdato 
        er oppgitt"]--> 
        ugyldig --> error1["Error: (faggruppe) Ugyldig vedtak fom dato"]

    
    faggruppe["faggruppe er oppgitt"]
    fagomraade["fagomraade er oppgitt"]
    
    ikkeAttesterte["Har valgt 1 av 2
    'ikke ferdig attestert'"]
    
    ikkeAttesterte ---->faggruppe--ja-->ok
    ikkeAttesterte ---->fagomraade--ja-->ok
    
    gjelderId["gjelderId 
        er oppgitt"] -->
    ikkeTall["GjelderId inneholder 
        andre tegn enn siffer"] --ja-->
    error2[Error: Ugyldig tegn i Gjelder ID]
    ikkeTall --nei--> lengde[lengde 9 eller 11] 
    lengde --nei--> error2[Error: Ugyldig Gjelder ID]
    lengde --ja--> ok

    fagsystemID["FagsystemID 
        er oppgitt"] --> alfanumeric["Inneholder noe annet enn 
        store/små bokstaver, sifre, underscore, 
        minus, punktum eller mellomrom
        "] --nei-->
    fagomraade1["fagomraade
    er oppgitt"] --ja--> ok
    fagomraade --nei--> error3[Error: Fagsystem id må kombineres med fagområde]
    alfanumeric --ja--> error4[Error: Ugyldig tegn i Fagsystem id]

    behandlendeEnhet["Behandlende Enhet er oppgitt"] -->
    alfanumeric2["Inneholder noe annet enn bokstaver, 
    tall, underscore, minus og punktum"] -->
    error5[Error: Ugydig tegn i BehandlendeEnhet]

    ikkeOk[Kom aldri til 'ok'] --> ingenAndreFeil[ingen andre feil] --> error6[Error: Minimum søkekriteria er ikke oppfylt!]
    
```

## Validering av utfylt tabell i Detaljer

```mermaid
    flowchart LR
    Oppdrag[For alle oppdrag] --> Linje[For alle linjer] --> Attest[For alle Attestasjoner] --> 
    Fjern[Hvis det er fjerning] --> UgyldigFomDato[Ikke gyldig dato] --> error7[Error: Ugyldig dato]
```

## Data

K231M782MsgVO
K231M5IDVO
K231M690VO attester
K231M710VO skattevedtak
K231M740VO maksbeløp

# Overordnet systemskisse
```mermaid
flowchart TD
    A["Mikrofrontend for 
    Attestasjon
"] -->|"Oppdatere
attestert status"| B(Modul i sokos-oppdrag)
B -->|Søk og visning| A
B -->|skriv| C[("DB2-oppdrag")]
C -->|les| B
```

## Mikrofrontend for Attestasjon

Mikrofrontend-template er en mal for frontendapplikasjoner som vi bruker som utgangspunkt.

## Modul i sokos-oppdrag
Sokos-oppdrag er en "modulær monolitt" som allerede har nødvendig konfigurasjon for å snakke med DB2-oppdrag. 
Det ser ut til å være de samme tabellene som oppdragsinfo bruker.

## Database
Spørringer for å hente ut data kan vi hente fra skjermbildet i Økonomiportalen.


```
		select  
			g.kode_faggruppe		as {att.faggruppe}
		  , g.navn_faggruppe		as {att.faggruppeNavn}
		  , o.kode_fagomraade		as {att.fagomraade}
		  , f.navn_fagomraade		as {att.fagomraadeNavn}
		  , o.oppdrags_id			as {att.oppdragsId}
		  , o.fagsystem_id			as {att.fagsystemId}
		  , o.oppdrag_gjelder_id	as {att.gjelderId}
		  , f.ant_attestanter		as {att.antall}
		  
		  , l.linje_id				as {att.linjeId}
		  , l.attestert				as {att.attestert}
		  , l.dato_vedtak_fom		as {att.vedtakFom}
		  , l.dato_vedtak_tom		as {att.vedtakTom}
		  
		  , ls.kode_status			as {att.statusKode}  
		  
		from t_faggruppe g join t_fagomraade f on g.kode_faggruppe = f.kode_faggruppe
			join t_oppdrag o on f.kode_fagomraade = o.kode_fagomraade 
			join t_oppdragslinje l on o.oppdrags_id = l.oppdrags_id
			join t_oppdrag_status s on s.oppdrags_id = l.oppdrags_id
			join t_linje_status ls on ls.oppdrags_id = l.oppdrags_id and ls.linje_id = l.linje_id
			left outer join t_korreksjon k on l.oppdrags_id = k.oppdrags_id and l.linje_id = k.linje_id
		where k.oppdrags_id IS NULL
		  and digits(o.oppdrags_id)			> :nextOppdragsId

		  and s.kode_status = 'AKTI'
		  and s.tidspkt_reg = ( select max(s2.tidspkt_reg)
								from t_oppdrag_status s2 
								where s.oppdrags_id = s2.oppdrags_id)

  		  and ls.tidspkt_reg = (select max(tidspkt_reg)
  		  					 from t_linje_status ls2
                 			 where ls2.oppdrags_id = ls.oppdrags_id
                			   and ls2.linje_id = ls.linje_id)
  
		  and f.kode_fagomraade 			= 	:kodeFagomraade
		  and o.oppdrag_gjelder_id 			= :gjelderId
		  and o.fagsystem_id 				like :fagsystemId
		  and l.attestert 					like :attestert
		  
		order by o.oppdrags_id
		fetch first 200 rows only
		optimize for 1 row
		with cs
		for fetch only
```
