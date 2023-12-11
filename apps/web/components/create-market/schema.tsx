import { z } from "zod";

export const createMarketSchema = z.object({
  type: z.string().optional().nullable(),
  prompt: z.string(),
  description: z.string(),
  resolution: z.string(),
  options: z.array(z.string()).optional().nullable(),
  closingDate: z.date(),
  // TODO add more fields
});

export type FormData = z.infer<typeof createMarketSchema>;
