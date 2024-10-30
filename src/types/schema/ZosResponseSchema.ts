import { z } from "zod";

const ResponsAttestasjonSchema = z.object({
  GjelderId: z.string(),
  OppdragsId: z.number(),
  AntLinjerMottatt: z.number(),
  Statuskode: z.number(),
  Melding: z.string(),
});

const AttestasjonskvitteringSchema = z.object({
  ResponsAttestasjon: ResponsAttestasjonSchema,
});

const OSAttestasjonOperationResponseSchema = z.object({
  Attestasjonskvittering: AttestasjonskvitteringSchema,
});

const schema = z.object({
  OSAttestasjonOperationResponse: OSAttestasjonOperationResponseSchema,
});

export default schema;
