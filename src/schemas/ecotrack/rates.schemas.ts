import { z } from "zod";

export const prettifiedRatesSchema = z.object({ rates: z.record(
  z.object({
    name: z.string(),
    delivery: z.object({ home: z.number(), stopDesk: z.number() }),
    pickup: z.object({ home: z.number(), stopDesk: z.number() }),
    exchange: z.object({ home: z.number(), stopDesk: z.number() }),
    recovery: z.object({ home: z.number(), stopDesk: z.number() }),
    returns: z.object({ home: z.number(), stopDesk: z.number() }),
  }),
) });

export type PrettifiedRates = z.infer<typeof prettifiedRatesSchema>;
