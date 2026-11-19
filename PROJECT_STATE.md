# Saber Brasil - Estado Atual do Repositório

## Status Atual
- Home (`src/app/page.tsx`) refatorada com o layout do Google Stitch.
- Module B (Políticos) entregue: tipos, diretório, perfil, loading/error.
- Module C (Votações & Indicadores) concluído (`SABER-C01` … `SABER-C05`).
- Module D (Comparador lado a lado) concluído (`SABER-D01` … `SABER-D03`).
- Module E (Presença Digital & Bridge Unificado) concluído (`SABER-E01` … `SABER-E03`).
- Module F (Trilhas & Match de Votações) concluído (`SABER-F01` … `SABER-F03`).
- Module G (Home Search Hub) concluído (`SABER-G01` … `SABER-G03`).
- Testes: `npx tsc --noEmit` sem erros; Vitest suite verde (51 testes).

## Module G — Home Search Hub
- Tipos: `src/types/home-hub.ts` (`UnifiedSearch*`, `HomeHubOverview`).
- Motor: `src/lib/search/unified-hub.ts` + testes (KPIs, fold diacrítico, filtros, hrefs).
- Home: `/` consome `getHomeHubOverview()` (`HubHero`, KPIs, esferas, votações, políticos, trilhas).
- Busca: `/busca` consome `searchUnifiedHub()` (`UnifiedSearchBar` + `UnifiedSearchResults`).
- Perf / resiliência: `error.tsx` em `/busca`; barrel `src/components/busca/`.
- Legado preservado: `src/lib/search/catalog.ts`, filtros/cards antigos em `src/components/busca/*`.

## Module F — Trilhas & Match de Votações
- Tipos: `src/types/learning.ts` (`EducationalTrail`, `TrailStep`, `CitizenVoteInput`, `VoteMatchResult`).
- Dados: `src/lib/data/learning.ts` — 3 trilhas neutras + `calculateVoteMatch` (ignora Skip/Absent; ranking por alinhamento).
- Testes: `learning.test.ts` (catálogo, dedupe, matemática de %, Absent, ordenação).
- UI: `/aprender` — `TrailDeckReader` + `VoteMatchSimulator` (client); nav **Aprender**.
- Perf / resiliência: `loading.tsx` e `error.tsx` em `/aprender`; barrel `src/components/aprender/`.
- Neutro: escolhas só em memória do browser; ranking quantitativo sem rótulos ideológicos.

## Module E — Presença Digital & Profile Bridge
- Tipos: `DigitalChannel`, `DigitalChannelPlatform`, `biographySummary`, `UnifiedProfileView` em `src/types/politician.ts`.
- Bridge: `src/lib/data/profile-bridge.ts` + `profile-bridge.test.ts` — catálogo primeiro, Supabase com fallback seguro.
- UI: `DigitalPresenceGrid` (Server) em `src/components/politicians/`; bio + CTA “Comparar parlamentar” no header.
- Rota: `/politicos/[id]` resolve via `resolveUnifiedPolitician` (catálogo e UUID Supabase).
- Skeleton: `loading.tsx` cobre bio, grade 3 colunas de canais, stats e abas.
- Barrel: `src/components/politicians/index.ts` exporta Server (`DigitalPresenceGrid`, card/header/stats) e Client (filters/tabs).
- Neutro: só links oficiais/catalogados e resumos factuais — sem juízo editorial.

## Module D — Comparar Políticos
- Tipos: `src/types/comparison.ts` (`ComparedPolitician`, `ComparedVotingRow`, `ComparisonHighlight`, `ComparisonReport`).
- Motor: `src/lib/data/comparison.ts` + `comparison.test.ts` (dedupe, cap 4, matriz de votos, destaques neutros).
- UI: `src/components/comparar/` — seletor (client), overview e voting matrix (server).
- Rota: `/comparar?ids=id1,id2,…` com presets guiados quando há menos de 2 selecionados.
- Nav: item **Comparar** em `src/components/navigation/nav-links.tsx`.
- Perf / resiliência: `loading.tsx` e `error.tsx` em `/comparar`.
- Neutro por desenho: só métricas quantitativas e posições nominais do catálogo.

## Module C — Votações & Indicadores
- Tipos: `src/types/voting.ts` (`Voting`, `IndividualVote`, `PartyVotingBreakdown`, `TransparencyIndicator`).
- Dados: `src/lib/data/votings.ts` + `votings.test.ts` (`Promise.resolve` mocks).
- UI nova (não confunde com legado):
  - `src/components/votings/` — cards, filtros, header, tabela partidária, votos individuais
  - `src/components/indicators/` — indicator cards, spending chart
- Rotas:
  - `/votacoes` — listagem com filtros URL (`q`, `category`, `outcome`)
  - `/votacoes/[id]` — detalhe com placar, coesão partidária e votos filtráveis
  - `/indicadores` — KPI strip, grade de indicadores, cota parlamentar ilustrativa
- Perf / resiliência:
  - `loading.tsx` em `/votacoes`, `/votacoes/[id]`, `/indicadores`
  - `error.tsx` em `/votacoes` e `/indicadores` (padrão do módulo Políticos)
- Legado preservado: `src/components/votacoes/`, `src/components/indicadores/`, `src/lib/indicadores/`.

## Home (referência)
- `src/components/home/hero-search.tsx`
- `src/components/home/featured-carousel.tsx`
- `src/components/home/featured-politicians.tsx`
- `src/components/home/educational-trails.tsx`
- `src/components/home/kpi-stats.tsx`
- `src/components/home/recent-votings.tsx`
- `src/components/home/news-feed.tsx`
- `src/components/home/sphere-selection.tsx`
- `src/components/home/sphere-modals.tsx`

## Variáveis de Tema (globals.css / shadcn)
- Suporte a tema claro e escuro via CSS variables (`--background`, `--foreground`, `--primary`, `--border`, `--success`, etc.).
- Gradiente do Hero customizado no `globals.css` alinhado ao Stitch.
