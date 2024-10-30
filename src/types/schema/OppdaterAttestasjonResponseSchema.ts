import { z } from "zod";

const schema = z.object({
  message: z.string().optional(),
});

export default schema;
