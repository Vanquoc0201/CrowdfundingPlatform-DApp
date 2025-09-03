import { z } from "zod";

export const createCampaignSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  goal: z.number().min(1),
  deadline: z.date(),
  minimumContribution: z.number().min(0.01),
  image: z.any().optional(),
});

export type CreateCampaignFormValues = z.infer<typeof createCampaignSchema>;