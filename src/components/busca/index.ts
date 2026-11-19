/**
 * Busca module barrel (Module G — unified search UI).
 *
 * Server-safe: UnifiedSearchResults (+ legacy PublicationResultCard,
 * VotingResultCard, SearchFilters).
 * Client leaves: UnifiedSearchBar, SearchCategoryTabs.
 *
 * Legacy files under `src/components/busca/*` are preserved.
 * Paths use `@/` aliases. Zero `any`. Neutral civic copy only.
 */

export {
  UnifiedSearchBar,
  type UnifiedSearchBarProps,
} from "./unified-search-bar";
export {
  UnifiedSearchResults,
  type UnifiedSearchResultsProps,
} from "./unified-search-results";

export {
  SearchCategoryTabs,
  type SearchCategory,
} from "./search-category-tabs";
export { SearchFilters } from "./search-filters";
export {
  PublicationResultCard,
  VotingResultCard,
} from "./search-result-cards";
