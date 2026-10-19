import { describe, expect, it } from "vitest";
import { politicalEvaluationSchema } from "./politicalEvaluation.schema";

const profileId = "11111111-1111-1111-1111-111111111111";

const scores = {
  posture: 4,
  decorum: 4,
  discursive_coherence: 4,
  articulation: 4,
  transparency: 4,
  accountability: 4,
  responsiveness: 4,
  ethical_conduct: 4,
  public_communication: 4,
  institutional_commitment: 4,
} as const;

describe("politicalEvaluationSchema", () => {
  it("accepts a complete evaluation", () => {
    const parsed = politicalEvaluationSchema.safeParse({ profileId, scores });
    expect(parsed.success).toBe(true);
  });

  it("rejects a missing profile and a score outside 1–5", () => {
    expect(politicalEvaluationSchema.safeParse({ scores }).success).toBe(false);
    expect(
      politicalEvaluationSchema.safeParse({
        profileId,
        scores: { ...scores, posture: 6 },
      }).success,
    ).toBe(false);
  });
});
