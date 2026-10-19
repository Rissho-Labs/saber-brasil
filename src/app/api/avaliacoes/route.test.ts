import { beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/auth/verify-turnstile";
import { saveUserEvaluation } from "@/lib/services/evaluations";
import { POST } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/auth/verify-turnstile", () => ({
  verifyTurnstileToken: vi.fn(),
  requestClientIp: vi.fn(() => null),
}));

vi.mock("@/lib/services/evaluations", () => ({
  saveUserEvaluation: vi.fn(),
}));

const userId = "22222222-2222-2222-2222-222222222222";
const profileId = "11111111-1111-1111-1111-111111111111";

const scores = {
  posture: 4,
  decorum: 4.5,
  discursive_coherence: 3,
  articulation: 5,
  transparency: 2,
  accountability: 1,
  responsiveness: 3.5,
  ethical_conduct: 4,
  public_communication: 2.5,
  institutional_commitment: 1.5,
} as const;

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/avaliacoes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

function mockSession(user: { id: string } | null, failed = false) {
  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getUser: vi.fn(async () => ({
        data: { user },
        error: failed ? { message: "invalid session" } : null,
      })),
    },
  } as unknown as Awaited<ReturnType<typeof createClient>>);
}

describe("POST /api/avaliacoes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(verifyTurnstileToken).mockResolvedValue({ ok: true });
  });

  it("returns 401 when the session is missing or invalid", async () => {
    mockSession(null, true);
    const missing = await post({});
    expect(missing.status).toBe(401);

    mockSession(null);
    const empty = await post({});
    expect(empty.status).toBe(401);

    mockSession({ id: "   " });
    const blank = await post({});
    expect(blank.status).toBe(401);
    expect(saveUserEvaluation).not.toHaveBeenCalled();
  });

  it("returns 400 when the authenticated payload is invalid", async () => {
    mockSession({ id: userId });

    const missingFields = await post({ profileId });
    expect(missingFields.status).toBe(400);

    const outOfBounds = await post({
      profileId,
      scores: { ...scores, posture: 6 },
    });
    expect(outOfBounds.status).toBe(400);
    expect(saveUserEvaluation).not.toHaveBeenCalled();
  });

  it("returns 201 for a new evaluation and 200 for an update", async () => {
    mockSession({ id: ` ${userId} ` });
    const payload = { profileId, scores };

    vi.mocked(saveUserEvaluation).mockResolvedValue({
      success: true,
      updated: false,
      message: "Avaliação registrada com sucesso.",
      evaluation: {
        user_id: userId,
        profile_id: profileId,
        scores,
      },
    });

    const created = await post(payload);
    expect(created.status).toBe(201);
    expect(saveUserEvaluation).toHaveBeenCalledWith(
      expect.anything(),
      userId,
      profileId,
      scores,
    );

    vi.mocked(saveUserEvaluation).mockResolvedValue({
      success: true,
      updated: true,
      message: "Avaliação atualizada.",
      evaluation: {
        user_id: userId,
        profile_id: profileId,
        scores,
      },
    });

    const updated = await post(payload);
    expect(updated.status).toBe(200);
  });
});
