# Saber Brasil - Estado Atual do Repositório

## Status Atual
- Home (`src/app/page.tsx`) refatorada com o layout do Google Stitch.
- Module B (Políticos) entregue: tipos, diretório, perfil, loading/error.
- Module C (Votações & Indicadores) concluído (`SABER-C01` … `SABER-C05`).
- Testes: `npx tsc --noEmit` sem erros; Vitest suite verde (32 testes).

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
