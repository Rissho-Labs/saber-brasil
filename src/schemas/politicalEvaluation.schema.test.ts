import { describe, expect, it } from "vitest";
import {
  politicalEvaluationCategories,
  politicalEvaluationSchema,
} from "@/schemas/politicalEvaluation.schema";

const base = {
  politicianId: "profile-1",
  rating: 3,
  category: "geral" as const,
};

describe("politicalEvaluationSchema", () => {
  describe("valid payloads", () => {
    it("accepts a complete payload and trims text", () => {
      const parsed = politicalEvaluationSchema.parse({
        politicianId: "  profile-1  ",
        rating: 5,
        category: "transparencia",
        comment: "  comentario valido  ",
        isAnonymous: true,
      });

      expect(parsed).toEqual({
        politicianId: "profile-1",
        rating: 5,
        category: "transparencia",
        comment: "comentario valido",
        isAnonymous: true,
      });
    });

    it("accepts a minimal payload and defaults isAnonymous to false", () => {
      const parsed = politicalEvaluationSchema.parse({
        politicianId: "profile-1",
        rating: 1,
        category: "projetos",
      });

      expect(parsed).toEqual({
        politicianId: "profile-1",
        rating: 1,
        category: "projetos",
        isAnonymous: false,
      });
      expect(parsed.comment).toBeUndefined();
    });
  });

  describe("rating boundaries", () => {
    it.each([0, 6, 4.5])("rejects rating %s", (rating) => {
      const result = politicalEvaluationSchema.safeParse({ ...base, rating });

      expect(result.success).toBe(false);
    });
  });

  describe("sanitization and length", () => {
    it.each(["", "   "])("rejects politicianId %j", (politicianId) => {
      const result = politicalEvaluationSchema.safeParse({ ...base, politicianId });

      expect(result.success).toBe(false);
    });

    it("rejects comments shorter than 10 or longer than 1000 after trim", () => {
      const short = ` ${"123456789"} `;
      const long = ` ${"a".repeat(1001)} `;

      expect(politicalEvaluationSchema.safeParse({ ...base, comment: short }).success).toBe(false);
      expect(politicalEvaluationSchema.safeParse({ ...base, comment: long }).success).toBe(false);
    });

    it("accepts comments of 10 and 1000 characters after trim", () => {
      const ten = politicalEvaluationSchema.parse({
        ...base,
        comment: ` ${"a".repeat(10)} `,
      });
      const thousand = politicalEvaluationSchema.parse({
        ...base,
        comment: ` ${"b".repeat(1000)} `,
      });

      expect(ten.comment).toHaveLength(10);
      expect(thousand.comment).toHaveLength(1000);
    });
  });

  describe("category enum", () => {
    it("accepts every allowed category", () => {
      for (const category of politicalEvaluationCategories) {
        const result = politicalEvaluationSchema.safeParse({ ...base, category });

        expect(result.success).toBe(true);
      }
    });

    it("rejects a category outside the allowlist", () => {
      const result = politicalEvaluationSchema.safeParse({ ...base, category: "admin" });

      expect(result.success).toBe(false);
    });
  });

  describe("strict object", () => {
    it("rejects an injected extra field", () => {
      const result = politicalEvaluationSchema.safeParse({
        ...base,
        role: "admin",
      });

      expect(result.success).toBe(false);
    });
  });
});
