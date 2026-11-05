# Saber Brasil - Estado Atual do Repositório

## Status Atual
- Home (`src/app/page.tsx`) 100% refatorada com o layout do Google Stitch.
- Testes: `tsc` sem erros, 21/21 testes unitários aprovados.
- Arquitetura de componentes da Home:
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
- Suporte a tema claro e escuro via CSS variables (`--background`, `--foreground`, `--primary`, `--border`, etc.).
- Gradiente do Hero customizado no `globals.css` alinhado ao Stitch.