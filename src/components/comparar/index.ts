/**
 * Parliamentarian comparator module barrel (Module D — SABER-D01…D03).
 *
 * Server-safe: ComparisonOverview, VotingMatrix.
 * Client leaves: PoliticianSelector — wrap in Suspense from Server Components
 * when the parent route hydrates the selection island.
 *
 * Paths use `@/` aliases. Zero `any`. Neutral quantitative framing only.
 */

export {
  PoliticianSelector,
  type PoliticianSelectorProps,
} from "./politician-selector";
export {
  ComparisonOverview,
  type ComparisonOverviewProps,
} from "./comparison-overview";
export { VotingMatrix, type VotingMatrixProps } from "./voting-matrix";
