import { z } from "zod";

export const politicalEvaluationCategories = [
  "transparencia",
  "projetos",
  "gestao",
  "geral",
] as const;

const trimmedText = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

export const politicalEvaluationSchema = z.strictObject({
  politicianId: trimmedText(1, 64),
  rating: z.number().int().min(1).max(5),
  category: z.enum(politicalEvaluationCategories),
  comment: trimmedText(10, 1000).optional(),
  isAnonymous: z.boolean().default(false),
});

export type PoliticalEvaluation = z.infer<typeof politicalEvaluationSchema>;
