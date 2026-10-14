# Saber Brasil — Governance, Architecture & Execution Report

> **Project Version:** Sprint 2 (In Progress)  
> **Last Updated:** October 2026  
> **Core Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL)

---

## 1. Technical Philosophy & Core Directives

- **LTS & Stability Priority:** STRICT adherence to stable and consolidated LTS versions within the React / Next.js ecosystem. Experimental ("bleeding edge") packages are STRICTLY PROHIBITED without a prior impact analysis and breaking changes report.
- **Database-First Incremental Delivery:** Features must be built incrementally. Data contracts and database schema must be fully defined before creating UI components.
- **Strict Typing (Zero `any`):** TypeScript types/interfaces MUST strictly map 1:1 to the PostgreSQL schema documented in `@ARCHITECTURE.md`.
- **Web Semantics & Accessibility:** Mandatory usage of semantic HTML5, ARIA labels for screen readers, and native keyboard navigation.

---

## 2. AI Protocol & Execution Rules (Cursor / Composer)

- **Prompt Context:** Every prompt provided to AI agents MUST explicitly include relevant file context (e.g., `@ARCHITECTURE.md`, `@types`, etc.) and unambiguous requirements.
- **Prompt ID Traceability:** All tasks and code generations MUST carry a unique identifier code (e.g., `SPRINT2-STEP1-PROJECTS-SERVICE`).
- **Execution Report Requirement:** After completing any task, the AI MUST output/append an execution entry containing:
  - `Prompt ID`
  - `Task`
  - `Files Modified / Created`
  - `Changes Summary`
  - `Status` & `Compilation Check`

---

## 3. Database Architecture & Business Rules (Supabase)

### Key Entities
- `public_profiles`: Representative data (name, sphere, role, status, badges).
- `user_evaluations`: Individual citizen evaluation ratings.
- `public_projects`: Legislative projects and proposals linked to representatives.

### Key Metrics
- **Carisma / Subjective Rating (1.0 to 5.0 Stars):** Dynamically calculated in PostgreSQL via trigger (`tr_update_carisma_rating`) and PL/pgSQL function based on the average of the 10 competency criteria.
- **Índice de Gestão (0 to 100):** Objective metric calculated from attendance and legislative activity.

### The 10 Competency Criteria
1. *Postura*
2. *Decoro*
3. *Coerência Discursiva*
4. *Articulação Política*
5. *Transparência*
6. *Accountability*
7. *Responsividade*
8. *Conduta Ética*
9. *Comunicação Pública*
10. *Compromisso Institucional*

---

## 4. Current Delivery Status

- [x] **Sprint 1:** Base setup, Cursor rules, Tailwind v4, visual architecture.
- [x] **Sprint 2 (Part 1):** Home Page (`HeroSearch`, `KPIStats`, Highlights, Voting).
- [x] **Sprint 2 (Part 2):** Representative Profile (`/politicos/[id]`), 10-criteria evaluation form, Supabase-integrated project list.
- [x] **Database:** SQL scripts, Enums, Triggers, RLS, and Seed data fully executed.

---

## 5. Architectural Roadmap & Risk Mitigation

1. **Authentication & Anti-Fraud in Citizen Ratings (Civic Protection)**
   - *Risk:* Bot/spam evaluation submissions skewing representative scores.
   - *Action:* Integrate Supabase Auth / OAuth (Google / Gov.br) and validate authenticated `user_id` in API routes to enforce one evaluation per citizen/representative.

2. **Real-time Government Open Data Sync**
   - *Risk:* Manual data entry causes information lag.
   - *Action:* Implement scheduled jobs (Cron Jobs / Supabase Edge Functions) to consume Open Data APIs from the Chamber of Deputies and Federal Senate.

3. **Server-Side Caching & Performance**
   - *Risk:* High database query load under concurrent user traffic.
   - *Action:* Apply Next.js App Router `revalidate` / `fetch` cache strategies, with demand-driven cache invalidation on new evaluations.

4. **Dynamic Sphere Filtering & Modals**
   - *Risk:* Navbar links (`#political`, `#judiciary`, `#academia`, `#security`) without immediate dynamic feedback.
   - *Action:* Create interactive modals/filters reorganizing search and highlights dynamically by selected sphere.

---

## 6. Execution History Log

### [2026-10-14] — `SPRINT2-STEP4-SPHERES-MODALS`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/home/sphere-modals.tsx` (CREATED)
  - `src/components/home/hero-search.tsx` (MODIFIED)
  - `src/app/page.tsx` (MODIFIED)
  - `TASKS.md` (MODIFIED)
- **Summary:** Implemented interactive tab/modal components for the 4 spheres (`POLITICA`, `JUDICIARIO`, `ACADEMIA`, `SEGURANCA`) featuring keyboard-accessible navigation, URL hash updating (`#political`, `#judiciary`, etc.), and direct search redirection (`/busca?sphere=<SPHERE>`).
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`.


### [2026-10-14] — `SPRINT2-STEP5-SEARCH-PAGE`
- **Status:** DONE
- **Arquivos Criados / Modificados:**
  - `src/app/busca/page.tsx` (CREATED)
  - `TASKS.md` (MODIFIED)
- **Resumo:** Criada a página `/busca` com suporte a filtros de texto (`q`) e esfera (`sphere`) via Server Component. Formulário preenchido automaticamente, integração com `getPublicProfiles`, tratamento de estado vazio ("Nenhum representante encontrado...") e cards vinculados a `/politicos/[id]`.
- **Status da Compilação:** Validado sem erros via `tsc --noEmit`.

### [2026-10-14] — `SPRINT2-STEP6-PROFILE-CARD`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/ui/profile-card.tsx` (CREATED)
  - `src/app/busca/page.tsx` (MODIFIED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** Added a reusable `ProfileCard` typed to `PublicProfile`. Sphere borders are green (`POLITICA`), blue (`JUDICIARIO`), light gray (`ACADEMIA`), and dark gray (`SEGURANCA`), with a sphere badge, star rating, Índice de Gestão, and a keyboard-accessible link to `/politicos/[id]`. Search results now render this card. These border colors identify the sphere; `ARCHITECTURE.md` §4 uses the same palette for activity status.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`.

### [2026-10-14] — `SPRINT2-STEP7-DUAL-SCORE-GRAPHIC`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/ui/dual-score-graphic.tsx` (CREATED)
  - `src/components/politicos/metrics-summary.tsx` (MODIFIED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** Added `DualScoreGraphic` typed with `Pick<PublicProfile, "carisma_rating" | "gestao_score">`. Carisma shows a 0–5 star row and meter; Índice de Gestão shows a 0–100 meter. Subjective and objective scores stay in separate cards. The politician profile renders it through `MetricsSummary`. No chart library was added.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`.

### [2026-10-14] — `SPRINT2-STEP8-QUESTIONNAIRE-MODAL`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/politicos/evaluation-modal.tsx` (CREATED)
  - `src/app/politicos/[id]/page.tsx` (MODIFIED)
  - `src/components/politicos/evaluation-form.tsx` (DELETED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The profile opens a native dialog with the 10 competency criteria from `CompetencyScores`. Each criterion has an ℹ️ explanation, a keyboard radiogroup of 1–5 stars, and a live average. Submit stays disabled until all 10 scores exist, then posts `{ profileId, scores }` to `/api/avaliacoes`. `showModal()` traps focus and Escape closes the dialog.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`.

### [2026-10-14] — `SPRINT2-STEP9-GEM-BADGES`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/ui/gem-badge.tsx` (CREATED)
  - `src/types/index.ts` (MODIFIED)
  - `src/components/ui/profile-card.tsx` (MODIFIED)
  - `src/components/home/featured-politicians.tsx` (MODIFIED)
  - `src/components/politicos/projects-list.tsx` (MODIFIED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** Added `GemTier` for the five agenda ranks in ARCHITECTURE.md §3.3 and a keyboard-focusable `GemBadge` with an SVG gem and tooltip. Highlights and search cards map the management index to a visual tier. Project cards map the higher institutional or citizen weight (1–5) to the same tiers. The schema does not persist a gem column.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`.

### [2026-10-14] — `SPRINT3-STEP1-AUTH-PROTECTION`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/lib/supabase/server.ts` (CREATED)
  - `src/lib/supabase/browser.ts` (CREATED)
  - `src/components/auth/login-form.tsx` (CREATED)
  - `src/app/login/page.tsx` (CREATED)
  - `supabase/evaluations-auth.sql` (CREATED)
  - `src/app/api/avaliacoes/route.ts` (MODIFIED)
  - `src/lib/services/evaluations.ts` (MODIFIED)
  - `src/components/politicos/evaluation-modal.tsx` (MODIFIED)
  - `supabase/schema.sql` (MODIFIED)
  - `package.json` (MODIFIED)
  - `package-lock.json` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `POST /api/avaliacoes` now reads the session with `createClient()` (`createServerClient` from `@supabase/ssr`) and returns 401 when `getUser()` has no user. Zod validates `profileId` and the 10 `CompetencyScores` before any write. An existing `(user_id, profile_id)` row is updated (200); the first row is inserted (201). The evaluation modal checks the browser session before `showModal()` and opens a login dialog that links to `/login?next=/politicos/[id]`. `@supabase/ssr` does not export a server `createClient`; the local helper wraps `createServerClient`. A repeat save stays an update because the unique constraint and carisma trigger already treat the citizen row as revisable. Risk: the live database still has `INSERT WITH CHECK (true)` and no UPDATE policy, so direct anon inserts remain possible and the update path fails until `supabase/evaluations-auth.sql` is executed in the Supabase SQL editor.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`. Unauthenticated POST returned 401. Signed-out “Avaliar representante” opened “Entre para avaliar” and the Entrar link reached `/login?next=/politicos/11111111-1111-1111-1111-111111111111`.

### [2026-10-14] — `SPRINT3-STEP2-UI-UX-AUDIT-AND-POLISH`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/app/busca/loading.tsx` (CREATED)
  - `src/app/politicos/[id]/loading.tsx` (CREATED)
  - `src/app/politicos/[id]/not-found.tsx` (CREATED)
  - `src/app/not-found.tsx` (CREATED)
  - `src/components/navbar.tsx` (MODIFIED)
  - `src/components/home/hero-search.tsx` (MODIFIED)
  - `src/components/home/featured-politicians.tsx` (MODIFIED)
  - `src/components/politicos/profile-header.tsx` (MODIFIED)
  - `src/components/politicos/evaluation-modal.tsx` (MODIFIED)
  - `src/components/ui/gem-badge.tsx` (MODIFIED)
  - `src/app/page.tsx` (MODIFIED)
  - `src/app/busca/page.tsx` (MODIFIED)
  - `src/app/politicos/[id]/page.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** Navbar sphere links now target `/#political`, `/#judiciary`, `/#academia`, and `/#security`, so they open the home tabs from any route. Highlight cards use the seed profile ids. The inert “Em alta” chips are name searches the current `name` filter can answer. There is no footer. Search and profile routes have skeletons, the empty search copy is unchanged, and unknown profiles or routes link back to search or home. Dialogs close on backdrop click; Escape remains the native dialog behavior; submit stays disabled until the form is complete or while login is pending. Page shells share `max-w-6xl` and `px-4 sm:px-6 lg:px-8`. Profile headers use the sphere border colors and no longer invent a party. Gem tooltips stay out of the layout until hover or focus, which removed a 9px phone overflow. Risk: a live successful sign-in was not executed because no Supabase user was available. Invalid credentials stay on `/login?next=/politicos/[id]`, and `LoginForm` returns with `router.push(nextPath)` after `signInWithPassword` succeeds.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`. Checked home, `/busca`, both seed profiles, missing profile, unknown route, login error, and widths 390, 768, and 1280 with no horizontal overflow.

### [2026-10-14] — `SPRINT3-STEP3-COMPREHENSIVE-SEED-DATA`
- **Status:** DONE
- **Files Created / Modified:**
  - `supabase/seed_spheres.sql` (CREATED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** Added an idempotent seed with 3 profiles in each sphere (12 total, including the existing Política ids). Each profile has two projects. The higher institutional or citizen weight covers 1 through 5, which the UI maps to Bronze, Silver, Gold, Platinum, and Diamond. `gestao_score` is the stored §3.1 index (attendance 20%, TSE coherence 30%, cross impact 50%) from 37 to 95, so profile gems also cover all five tiers. Twenty-four evaluations use the 10 `CompetencyScores` keys; `tr_update_carisma_rating` is what writes `carisma_rating` (1.80–4.80). There is no avatar column and no `ProjectStatus` enum; project status stays the existing text values `EM_TRAMITACAO` and `APROVADO`. Names with `CASSADO` or `CONDENADO` are fictional. Risk: the script is not applied. Run it in the Supabase SQL editor as the database owner. The anon key cannot insert these rows.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`. Score averages checked at 4.8, 4.5, 4.7, 4.2, 3.5, 3.8, 4.4, 4.0, 2.5, 4.1, 2.8, and 1.8.