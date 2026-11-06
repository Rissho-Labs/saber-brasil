/**
 * Politician module barrel.
 *
 * Server-safe: PoliticianCard, PoliticianHeader, PoliticianStats (+ helpers/types).
 * Client leaves: PoliticianFilters, PoliticianActivityTabs — deep-import from Server
 * Components when you only need a server leaf to avoid pulling client boundaries.
 */

export { PoliticianCard, type PoliticianCardProps } from "./politician-card";
export {
  PoliticianHeader,
  type PoliticianHeaderProps,
  type PoliticianSocialLink,
} from "./politician-header";
export {
  PoliticianStats,
  legislativeActivityScore,
  type PoliticianStatsProps,
} from "./politician-stats";

export { PoliticianFilters, type PoliticianFiltersProps } from "./politician-filters";
export {
  PoliticianActivityTabs,
  type PoliticianActivityTabsProps,
} from "./politician-activity-tabs";
