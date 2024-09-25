import { describe, expect, test } from "vitest";
import { enLinjePerAttestasjon } from "../src/components/detaljer/detaljerUtils";

const mockOppdragslinje = {
  oppdragsLinje: {
    attestert: true,
    datoVedtakFom: "2023-01-01",
    datoVedtakTom: "2023-12-31",
    delytelseId: "12345",
    kodeKlasse: "A1",
    linjeId: 1,
    oppdragsId: 1001,
    sats: 5000,
    typeSats: "monthly",
  },
  ansvarsStedForOppdragsLinje: "Finance",
  kostnadsStedForOppdragsLinje: "HR",
  attestasjoner: [
    {
      attestant: "saksbehandler",
      datoUgyldigFom: "2023-06-01",
    },
  ],
};

function withPreviousAttestant(attestant: string) {
  return {
    ...mockOppdragslinje,
    attestasjoner: [{ attestant }],
  };
}

describe("When oppdragslinjes needs 1 attestant", () => {
  describe("when the linje has no attestasjon from before", () => {
    const noPreviousAttestasjonTest = test.extend({
      antallAttestanter: 1,
      linje: { ...mockOppdragslinje, attestasjoner: [] },
      innloggetSaksbehandler: "X313373",
    });
    noPreviousAttestasjonTest(
      "enLinjePerAttestasjon should return 1 linje without attestasjons",
      ({ linje, antallAttestanter, innloggetSaksbehandler }) => {
        const result = enLinjePerAttestasjon(
          linje,
          antallAttestanter,
          innloggetSaksbehandler,
        );

        expect(result).toHaveLength(1);
        expect(result.at(0)?.attestasjoner).toHaveLength(0);
      },
    );
  });
  describe("when the linje has 1 attestasjon from before", () => {
    const oneAttestasjonFromBeforeTest = test.extend({
      antallAttestanter: 1,
      linje: withPreviousAttestant("The same saksbehandler"),
    });
    describe("enLinjePerAttestasjon should return 1 linje", () => {
      oneAttestasjonFromBeforeTest(
        "when the same saksbehandler is logged in",
        ({ antallAttestanter, linje }) => {
          const innloggetSaksbehandler = "The same saksbehandler";

          const result = enLinjePerAttestasjon(
            linje,
            antallAttestanter,
            innloggetSaksbehandler,
          );

          expect(
            result,
            "enLinjePerAttestasjon should return 1 linje",
          ).toHaveLength(1);

          expect(result.at(0)?.attestasjoner).toHaveLength(1);
          expect(result.at(0)?.attestasjoner.at(0)?.attestant).toBe(
            "The same saksbehandler",
          );
        },
      );

      oneAttestasjonFromBeforeTest(
        "when a different saksbehandler is logged in",
        ({ antallAttestanter, linje }) => {
          const innloggetSaksbehandler = "A different saksbehandler";

          const result = enLinjePerAttestasjon(
            linje,
            antallAttestanter,
            innloggetSaksbehandler,
          );

          expect(result, "Should have one lines").toHaveLength(1);

          expect(result.at(0)?.attestasjoner).toHaveLength(1);
          expect(result.at(0)?.attestasjoner.at(0)?.attestant).toBe(
            "The same saksbehandler",
          );
        },
      );
    });
  });
  describe("when the linje has 2 attestasjons from before", () => {
    const twoAttestasjonsFromBeforeTest = test.extend({
      antallAttestanter: 1,
      linje: {
        ...mockOppdragslinje,
        attestasjoner: [
          { attestant: "The first saksbehandler" },
          { attestant: "A second saksbehandler" },
        ],
      },
    });
    describe("enLinjePerAttestasjon should return 2 linjes", () => {
      twoAttestasjonsFromBeforeTest(
        "when the same first saksbehandler is logged in",
        ({ antallAttestanter, linje }) => {
          const innloggetSaksbehandler = "The first saksbehandler";

          const result = enLinjePerAttestasjon(
            linje,
            antallAttestanter,
            innloggetSaksbehandler,
          );

          expect(
            result,
            "enLinjePerAttestasjon should return 2 linjes",
          ).toHaveLength(2);

          expect(result.at(0)?.attestasjoner).toHaveLength(1);
          expect(result.at(0)?.attestasjoner.at(0)?.attestant).toBe(
            "The first saksbehandler",
          );

          expect(result.at(1)?.attestasjoner).toHaveLength(1);
          expect(result.at(1)?.attestasjoner.at(0)?.attestant).toBe(
            "A second saksbehandler",
          );
        },
      );

      twoAttestasjonsFromBeforeTest(
        "when a different saksbehandler is logged in",
        ({ antallAttestanter, linje }) => {
          const innloggetSaksbehandler = "A different saksbehandler";

          const result = enLinjePerAttestasjon(
            linje,
            antallAttestanter,
            innloggetSaksbehandler,
          );

          expect(result, "Should have 2 linjes").toHaveLength(2);
        },
      );
    });
  });
});

describe("When oppdragslinjes need 2 attestants", () => {
  describe("when the linje has no attestasjon from before", () => {
    const noPreviousAttestasjonTest = test.extend({
      antallAttestanter: 2,
      linje: { ...mockOppdragslinje, attestasjoner: [] },
      innloggetSaksbehandler: "X313373",
    });
    noPreviousAttestasjonTest(
      "enLinjePerAttestasjon should still return only 1 linje",
      ({ linje, antallAttestanter, innloggetSaksbehandler }) => {
        const result = enLinjePerAttestasjon(
          linje,
          antallAttestanter,
          innloggetSaksbehandler,
        );

        expect(result).toHaveLength(1);
        expect(
          result.at(0)?.attestasjoner,
          "and that linje should have no attestasjons",
        ).toHaveLength(0);
      },
    );
  });
  describe("when the linje already has 1 attestasjon", () => {
    const oneAttestasjonTest = test.extend({
      antallAttestanter: 2,
      linje: withPreviousAttestant("The same saksbehandler"),
    });
    describe("enLinjePerAttestasjon should return", () => {
      oneAttestasjonTest(
        "2 linjes when a different saksbehandler is logged in",
        ({ antallAttestanter, linje }) => {
          const innloggetSaksbehandler = "A different saksbehandler";

          const result = enLinjePerAttestasjon(
            linje,
            antallAttestanter,
            innloggetSaksbehandler,
          );

          expect(
            result,
            "Should have two lines, the attestert linje and another linje ready to be attestert",
          ).toHaveLength(2);

          expect(result.at(0)?.attestasjoner).toHaveLength(1);
          expect(result.at(0)?.attestasjoner.at(0)?.attestant).toBe(
            "The same saksbehandler",
          );
          expect(
            result.at(1)?.attestasjoner,
            "and the second linje should have no attestasjons",
          ).toHaveLength(0);
        },
      );

      oneAttestasjonTest(
        "1 linje when the same saksbehandler is logged in",
        ({ linje, antallAttestanter }) => {
          const innloggetSaksbehandler = "The same saksbehandler";

          const result = enLinjePerAttestasjon(
            linje,
            antallAttestanter,
            innloggetSaksbehandler,
          );

          expect(result, "Should contain one linje").toHaveLength(1);
          expect(
            result.at(0)?.attestasjoner,
            "And that linje should already have 1 attestasjon",
          ).toHaveLength(1);
          expect(result.at(0)?.attestasjoner?.at(0)?.attestant).toBe(
            "The same saksbehandler",
          );
        },
      );
    });
  });
  describe("when the linje already has 2 attestasjons", () => {
    const twoAttestasjonTest = test.extend({
      antallAttestanter: 2,
      linje: {
        ...mockOppdragslinje,
        attestasjoner: [
          { attestant: "The first saksbehandler" },
          { attestant: "A second saksbehandler" },
        ],
      },
    });
    describe("enLinjePerAttestasjon should return 2 linjes", () => {
      twoAttestasjonTest(
        "when the same saksbehandler is logged in",
        ({ linje, antallAttestanter }) => {
          const innloggetSaksbehandler = "The first saksbehandler";
          const result = enLinjePerAttestasjon(
            linje,
            antallAttestanter,
            innloggetSaksbehandler,
          );
          expect(result, "Should have two linjes").toHaveLength(2);

          expect(
            result.at(0)?.attestasjoner,
            "Should have one attestasjon",
          ).toHaveLength(1);
          expect(result.at(0)?.attestasjoner?.at(0)?.attestant).toBe(
            "The first saksbehandler",
          );

          expect(
            result.at(1)?.attestasjoner,
            "Should also have one attestasjon",
          ).toHaveLength(1);
          expect(result.at(1)?.attestasjoner?.at(0)?.attestant).toBe(
            "A second saksbehandler",
          );
        },
      );
      twoAttestasjonTest(
        "when a different saksbehandler is logged in",
        ({ linje, antallAttestanter }) => {
          const innloggetSaksbehandler = "A different saksbehandler";
          const result = enLinjePerAttestasjon(
            linje,
            antallAttestanter,
            innloggetSaksbehandler,
          );
          expect(
            result,
            "enLinjePerAttestasjon should return two linjes",
          ).toHaveLength(2);

          expect(
            result.at(0)?.attestasjoner,
            "Should have one attestasjon",
          ).toHaveLength(1);
          expect(result.at(0)?.attestasjoner?.at(0)?.attestant).toBe(
            "The first saksbehandler",
          );

          expect(
            result.at(1)?.attestasjoner,
            "Should also have one attestasjon",
          ).toHaveLength(1);
          expect(result.at(1)?.attestasjoner?.at(0)?.attestant).toBe(
            "A second saksbehandler",
          );
        },
      );
    });
  });
  describe("when the linje already has 3 attestasjons", () => {
    const threeAttestasjonTest = test.extend({
      antallAttestanter: 2,
      linje: {
        ...mockOppdragslinje,
        attestasjoner: [
          { attestant: "The first saksbehandler" },
          { attestant: "A second saksbehandler" },
          { attestant: "A third saksbehandler" },
        ],
      },
    });
    describe("enLinjePerAttestasjon should return 3 linjes", () => {
      threeAttestasjonTest(
        "when any saksbehandler is logged in",
        ({ linje, antallAttestanter }) => {
          const innloggetSaksbehandler = "Any saksbehandler";
          const result = enLinjePerAttestasjon(
            linje,
            antallAttestanter,
            innloggetSaksbehandler,
          );
          expect(result, "Should have three linjes").toHaveLength(3);

          expect(
            result.at(0)?.attestasjoner,
            "Should have one attestasjon",
          ).toHaveLength(1);
          expect(result.at(0)?.attestasjoner?.at(0)?.attestant).toBe(
            "The first saksbehandler",
          );

          expect(
            result.at(1)?.attestasjoner,
            "Should also have one attestasjon",
          ).toHaveLength(1);
          expect(result.at(1)?.attestasjoner?.at(0)?.attestant).toBe(
            "A second saksbehandler",
          );

          expect(
            result.at(2)?.attestasjoner,
            "Should also have one attestasjon",
          ).toHaveLength(1);
          expect(result.at(2)?.attestasjoner?.at(0)?.attestant).toBe(
            "A third saksbehandler",
          );
        },
      );
    });
  });
});
