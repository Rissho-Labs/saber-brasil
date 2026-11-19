import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getPoliticianById, getPoliticians } from "@/lib/data/politicians";
import { getVotingById, getVotings } from "@/lib/data/votings";
import {
  clearOpenDataSnapshotCache,
  runOpenDataSyncPipeline,
} from "@/lib/open-data/sync-service";
import type { Politician } from "@/types/politician";
import type { Voting } from "@/types/voting";

const fetchCamaraDeputies = vi.fn();
const fetchCamaraVotings = vi.fn();
const fetchSenadoSenators = vi.fn();

vi.mock("@/lib/open-data/camara-adapter", () => ({
  fetchCamaraDeputies: (...args: unknown[]) => fetchCamaraDeputies(...args),
  fetchCamaraVotings: (...args: unknown[]) => fetchCamaraVotings(...args),
}));

vi.mock("@/lib/open-data/senado-adapter", () => ({
  fetchSenadoSenators: (...args: unknown[]) => fetchSenadoSenators(...args),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      upsert: vi.fn(async () => ({ error: null })),
      select: vi.fn(() => ({
        limit: vi.fn(async () => ({ data: [], error: null })),
      })),
    })),
  })),
}));

const liveDeputy: Politician = {
  id: "camara-204554",
  name: "Live Deputado",
  civilName: "Live Deputado Civil",
  party: "PSD",
  state: "SP",
  role: "deputado",
  photoUrl: null,
  email: "live@camara.leg.br",
  phone: "",
  metrics: { presenceRate: 0, proposalsCount: 0, votingAlignmentPercentage: 0 },
};

const collidingLocalId: Politician = {
  id: "pol-dep-beatriz-rocha",
  name: "Live Shadow Beatriz",
  civilName: "Should Not Win",
  party: "XX",
  state: "AC",
  role: "deputado",
  photoUrl: null,
  email: "",
  phone: "",
  metrics: { presenceRate: 1, proposalsCount: 1, votingAlignmentPercentage: 1 },
};

const liveVoting: Voting = {
  id: "camara-vot-2265124-70",
  billCode: "PLP 19/2019",
  title: "Live voting from Câmara",
  summary: "Resumo técnico live",
  plainSummary: "Resumo claro live",
  category: "Administração Pública",
  voteDate: "2021-02-10",
  result: "Approved",
  rapporteur: "Não informado",
  totalYes: 0,
  totalNo: 0,
  totalAbstain: 0,
  institutionalUrgency: 3,
  citizenPriority: 3,
};

function okResult<T>(source: "camara" | "senado", items: T[]) {
  return {
    source,
    ok: true,
    items,
    fetchedAt: new Date().toISOString(),
    fromFallback: false,
  };
}

describe("live open-data provider bridge", () => {
  const previousFlag = process.env.SABER_USE_LIVE_OPEN_DATA;

  beforeEach(() => {
    clearOpenDataSnapshotCache();
    vi.clearAllMocks();
    delete process.env.SABER_USE_LIVE_OPEN_DATA;
  });

  afterEach(() => {
    clearOpenDataSnapshotCache();
    if (previousFlag === undefined) {
      delete process.env.SABER_USE_LIVE_OPEN_DATA;
    } else {
      process.env.SABER_USE_LIVE_OPEN_DATA = previousFlag;
    }
  });

  it("keeps curated catalog only when flag is false/unset", async () => {
    fetchCamaraDeputies.mockResolvedValue(
      okResult("camara", [liveDeputy, collidingLocalId]),
    );
    fetchCamaraVotings.mockResolvedValue(okResult("camara", [liveVoting]));
    fetchSenadoSenators.mockResolvedValue(okResult("senado", []));
    await runOpenDataSyncPipeline();

    process.env.SABER_USE_LIVE_OPEN_DATA = "false";

    const politicians = await getPoliticians();
    expect(politicians.some((row) => row.id === "camara-204554")).toBe(false);
    expect(politicians[0]?.id).toBe("pol-dep-beatriz-rocha");
    expect(await getPoliticianById("camara-204554")).toBeNull();

    const votings = await getVotings();
    expect(votings.some((row) => row.id === "camara-vot-2265124-70")).toBe(false);
    expect(await getVotingById("camara-vot-2265124-70")).toBeNull();
    expect(await getVotingById("vot-pl-1904-2024")).not.toBeNull();
  });

  it("merges live snapshot when flag is true, preserving local on id collision", async () => {
    fetchCamaraDeputies.mockResolvedValue(
      okResult("camara", [liveDeputy, collidingLocalId]),
    );
    fetchCamaraVotings.mockResolvedValue(okResult("camara", [liveVoting]));
    fetchSenadoSenators.mockResolvedValue(okResult("senado", []));
    await runOpenDataSyncPipeline();

    process.env.SABER_USE_LIVE_OPEN_DATA = "true";

    const politicians = await getPoliticians();
    expect(politicians.some((row) => row.id === "camara-204554")).toBe(true);
    const localBeatriz = politicians.find((row) => row.id === "pol-dep-beatriz-rocha");
    expect(localBeatriz?.name).toBe("Beatriz Rocha");
    expect(localBeatriz?.party).toBe("PSD");

    const live = await getPoliticianById("camara-204554");
    expect(live?.name).toBe("Live Deputado");

    const votings = await getVotings();
    expect(votings.some((row) => row.id === "vot-pl-1904-2024")).toBe(true);
    expect(votings.some((row) => row.id === "camara-vot-2265124-70")).toBe(true);

    const liveVote = await getVotingById("camara-vot-2265124-70");
    expect(liveVote?.billCode).toBe("PLP 19/2019");
  });

  it("falls back to catalog when flag is true but snapshot is empty", async () => {
    process.env.SABER_USE_LIVE_OPEN_DATA = "true";
    clearOpenDataSnapshotCache();

    const politicians = await getPoliticians();
    expect(politicians.some((row) => row.id.startsWith("camara-"))).toBe(false);
    expect(politicians[0]?.id).toBe("pol-dep-beatriz-rocha");

    const votings = await getVotings();
    expect(votings[0]?.id).toBe("vot-pl-1904-2024");
  });
});
