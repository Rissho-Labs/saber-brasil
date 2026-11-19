/**
 * Legislative votings module barrel (Module C — SABER-C01…C05).
 *
 * Server-safe: VotingCard, VotingHeader, PartyAlignmentTable.
 * Client leaves: VotingFilters, IndividualVotesList.
 *   - Wrap VotingFilters in Suspense (uses useSearchParams).
 *   - IndividualVotesList is a client island and may be imported directly.
 *
 * Paths use `@/` aliases. Zero `any`.
 */

export { VotingCard, type VotingCardProps } from "./voting-card";
export { VotingFilters } from "./voting-filters";
export { VotingHeader, type VotingHeaderProps } from "./voting-header";
export {
  PartyAlignmentTable,
  type PartyAlignmentTableProps,
} from "./party-alignment-table";
export {
  IndividualVotesList,
  type IndividualVotesListProps,
} from "./individual-votes-list";
