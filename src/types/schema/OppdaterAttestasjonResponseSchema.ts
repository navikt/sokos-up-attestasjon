import { z } from "zod";

const schema = z.object({
  message: z.string(),
});

export default schema;
