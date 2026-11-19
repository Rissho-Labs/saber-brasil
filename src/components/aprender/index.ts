/**
 * Aprender module barrel (Module F — SABER-F01…F03).
 *
 * Client leaves: TrailDeckReader, VoteMatchSimulator — import from Server
 * Components as islands; do not pull into shared server-only trees.
 * Route resilience: `src/app/aprender/loading.tsx` + `error.tsx`.
 *
 * Paths use `@/` aliases. Zero `any`. Neutral civic pedagogy only.
 */

export {
  TrailDeckReader,
  type TrailDeckReaderProps,
} from "./trail-deck-reader";
export {
  VoteMatchSimulator,
  type VoteMatchSimulatorProps,
} from "./vote-match-simulator";
