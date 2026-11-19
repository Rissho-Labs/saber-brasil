/**
 * Transparency indicators module barrel (Module C — SABER-C01…C05).
 *
 * Server-safe: IndicatorCard, SpendingSummaryChart.
 * No client leaves in this module.
 *
 * Paths use `@/` aliases. Zero `any`.
 */

export { IndicatorCard, type IndicatorCardProps } from "./indicator-card";
export { SpendingSummaryChart } from "./spending-summary-chart";
