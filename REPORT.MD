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

### [2026-10-15] — `SPRINT3-STEP4-SIGNUP-OTP-FLOW`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/lib/auth/safe-next-path.ts` (CREATED)
  - `src/components/auth/signup-form.tsx` (CREATED)
  - `src/components/auth/otp-verification-form.tsx` (CREATED)
  - `src/app/cadastro/page.tsx` (CREATED)
  - `src/app/verificar-email/page.tsx` (CREATED)
  - `src/app/login/page.tsx` (MODIFIED)
  - `src/components/auth/login-form.tsx` (MODIFIED)
  - `src/components/politicos/evaluation-modal.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `/cadastro` collects name, email, password, and confirmation. Zod rejects a short name, an invalid email, a password outside 8–72 characters, and a mismatched confirmation before `signUp`. The name is stored only as `full_name` user metadata. When Supabase returns no session, the app opens `/verificar-email` with one centered field (`text-3xl` / `text-4xl`, `font-mono`, `tracking-[0.5em]`), `inputMode="numeric"`, and `aria-label="Código de verificação de 6 dígitos"`. Non-digits are stripped and the value stops at 6. `verifyOtp` uses type `signup`; a bad or expired code stays on the page. Resend waits 60 seconds. A valid code calls `router.push(nextPath)`. If confirmations are off and `signUp` already returns a session, the OTP step is skipped. Risk: the Supabase signup email template must include `{{ .Token }}` and confirmations must be enabled, or the user receives a link instead of a 6-digit code. A real account was not created during the check.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`. Invalid signup fields showed the four messages. The OTP field kept `123456` from mixed input, rejected `123456` for an unknown address, and fit a 390px width with no horizontal overflow.

### [2026-10-15] — `SPRINT3-STEP6-GOOGLE-OAUTH-LOGIN`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/lib/auth/social-login.ts` (CREATED)
  - `src/components/auth/google-sign-in.tsx` (CREATED)
  - `src/app/auth/callback/route.ts` (CREATED)
  - `src/components/auth/login-form.tsx` (MODIFIED)
  - `src/components/auth/signup-form.tsx` (MODIFIED)
  - `src/app/login/page.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `/login` and `/cadastro` start Google OAuth with `signInWithOAuth`. `redirectTo` is `/auth/callback?next=` and `safeNextPath` keeps the return path on the same origin, including `/politicos/[id]`. The callback validates the query with Zod, exchanges the code for the session cookie, and sends a missing or rejected code back to `/login?error=google` without dropping `next`. The button shows the Google mark and “Continuar com Google”, then “Redirecionando...” while disabled. “ou continue com e-mail” separates it from the email fields. A second click is ignored while the redirect is pending. Risk: the Supabase redirect allow list must include the deployed `/auth/callback` origin. A Google account was not completed; the browser reached the Google sign-in screen with the profile `next` path, and an external `next` value fell back to `/`.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`. Login and sign-up showed the button, divider, and email fields at 390px with no horizontal overflow. A callback without `code` redirected to `/login?next=/politicos/[id]&error=google`, and that page showed “Não foi possível continuar com o Google.”

### [2026-10-15] — `SPRINT3-STEP5-FEATURED-DYNAMIC-CAROUSEL`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/home/featured-carousel.tsx` (CREATED)
  - `src/components/home/featured-politicians.tsx` (MODIFIED)
  - `src/lib/services/profiles.ts` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The home highlight block now loads up to 4 `public_profiles` per sphere, ordered by `gestao_score` and then `carisma_rating`. Zod drops any row that does not match the profile contract. Tabs switch `POLITICA`, `JUDICIARIO`, `ACADEMIA`, and `SEGURANCA`. Cards reuse `ProfileCard`, which already draws the sphere border, `GemBadge`, and both scores. The full `DualScoreGraphic` stays on the profile page because it is a headed section and would repeat the same heading inside every card. The left chevron is hidden at scroll position 0 and appears after a smooth scroll to the right. The right chevron disables when the last card is in view. “Ver mais” points to `/busca?sphere=<ESFERA>`. Risk: the current seed has 3 profiles per sphere, so the query asks for 4 and the UI shows the 3 that exist. A fourth profile appears automatically when it is stored.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`. Política showed Ana Beatriz (95), Mariana Silva (92), and Carlos Eduardo (88). After sliding right on a 390px width, the previous control became visible. Judiciário reset to the start and linked “Ver mais” to `/busca?sphere=JUDICIARIO`, which listed the three judiciary profiles.

### [2026-10-15] — `SPRINT3-STEP7-HISTORICAL-STATUS-FILTERS`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/types/index.ts` (MODIFIED)
  - `src/components/ui/mandate-badge.tsx` (CREATED)
  - `src/components/busca/search-filters.tsx` (CREATED)
  - `src/components/ui/profile-card.tsx` (MODIFIED)
  - `src/components/politicos/profile-header.tsx` (MODIFIED)
  - `src/app/busca/page.tsx` (MODIFIED)
  - `supabase/schema.sql` (MODIFIED)
  - `supabase/seed_spheres.sql` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `MandateStatus` is `EM_MANDATO`, `EX_MANDATO`, or `CANDIDATO`. It is derived from the stored `profile_status`: `ATIVO` becomes Em Exercício, `CANDIDATO` stays Candidato, and `INATIVO` or `ENCERRADO` become Ex-mandatário. A missing status falls back to Em Exercício. The Postgres enum was not replaced, because the live table and seed already use those four values and adding a second enum would break inserts. `/busca` validates `sphere` and `status` with Zod and keeps them in the query string. Cards and the profile header show a green, slate, or amber badge. Risk: a stored `ATIVO` with an alert badge such as `CASSADO` still appears as Em Exercício, because the mandate comes from `status`, not from the integrity badge.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`. `status=CANDIDATO` returned Camila Torres. Submitting Academia plus Ex-mandatários opened `/busca?sphere=ACADEMIA&status=EX_MANDATO` and showed Jorge Almeida. `status=EM_MANDATO` returned the eight active profiles and hid the candidate and the three former profiles. Jorge’s header reads Ex-mandatário and Mariana Silva’s reads Em Exercício. The search page fit a 390px width.

### [2026-10-15] — `SPRINT3-STEP8-ANTIBOT-TURNSTILE`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/lib/auth/verify-turnstile.ts` (CREATED)
  - `src/lib/auth/turnstile-action.ts` (CREATED)
  - `src/components/ui/turnstile-widget.tsx` (CREATED)
  - `src/app/api/avaliacoes/route.ts` (MODIFIED)
  - `src/components/politicos/evaluation-modal.tsx` (MODIFIED)
  - `src/components/auth/login-form.tsx` (MODIFIED)
  - `src/components/auth/signup-form.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** Email login, sign-up, and the evaluation form render a Turnstile widget from `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. The secret stays in `TURNSTILE_SECRET_KEY` and is sent only from the server to `https://challenges.cloudflare.com/turnstile/v0/siteverify`. `POST /api/avaliacoes` checks the token with Zod after authentication and before the database write, and returns 400 when verification fails. Login and sign-up call the same check through a server action before `signInWithPassword` or `signUp`. When the keys are absent outside production, the widget says the check is off and the server allows the request. In production, a missing secret fails closed. A custom widget was used instead of a new package. Risk: “Continuar com Google” does not pass through Turnstile; Google’s own sign-in is the bot gate for that path. The live keys are not set, so this environment shows the disabled notice.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`. `/login` and `/cadastro` showed “Verificação anti-bot desativada neste ambiente.” An unauthenticated evaluation POST returned 401. With no secret, development verification returned ok and production returned “Verificação anti-bot indisponível.” An invalid token against siteverify returned “A verificação anti-bot falhou. Tente novamente.”

### [2026-10-15] — `SPRINT3-STEP9-BUILD-VERIFICATION-AND-PRODUCTION-CHECK`
- **Status:** DONE
- **Files Created / Modified:**
  - `.env.example` (CREATED)
  - `.gitignore` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `.env.example` lists the variables the app reads: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY`. Google OAuth and Resend are documented as unused by this Next.js code: Google is configured in the Supabase Auth dashboard, and signup mail is sent by Supabase Auth. `.gitignore` ignored every `.env*` file, so `!.env.example` was added or the template could not be committed. `npm run build` completed with no ESLint, TypeScript, or route warning. `/politicos/[id]`, `/auth/callback`, and `/api/avaliacoes` are dynamic server routes. No hydration warning appeared in the build output, so no source change was required for one.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit` and `npm run build` (Next.js 15.5.27, 13 routes).

### [2026-10-15] — `SPRINT4-STEP1-USER-PROFILE-AND-HISTORY`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/app/perfil/page.tsx` (CREATED)
  - `src/components/perfil/user-info.tsx` (CREATED)
  - `src/components/perfil/user-evaluations.tsx` (CREATED)
  - `src/components/navbar-session.tsx` (CREATED)
  - `src/app/api/avaliacoes/[id]/route.ts` (CREATED)
  - `src/lib/services/user-history.ts` (CREATED)
  - `src/lib/auth/account-actions.ts` (CREATED)
  - `supabase/evaluations-delete.sql` (CREATED)
  - `src/components/navbar.tsx` (MODIFIED)
  - `src/components/politicos/evaluation-modal.tsx` (MODIFIED)
  - `supabase/schema.sql` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `/perfil` redirects anonymous visitors to `/login?next=/perfil`. A signed-in page shows name, email, sign-up date, and whether the account uses Google or email. Email accounts can change the password through a Zod-checked server action; Google accounts are told the password stays with Google. Both can sign out. The history loads that user’s `user_evaluations`, matches `public_profiles`, and lists carisma plus the ten scores. Edit reopens `EvaluationModal` with the saved scores. Delete asks for confirmation and calls `DELETE /api/avaliacoes/[id]`, which only removes the caller’s row. The navbar shows Entrar when signed out and Meu Perfil / Sair when signed in. Risk: the live database still has no DELETE policy and the carisma trigger ignores deletes until `supabase/evaluations-delete.sql` is run in the SQL editor. Without that, the API returns 404 and the public rating stays stale.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`. A request without cookies to `/perfil` returned 307 to `/login?next=/perfil`. The signed-in page showed the account fields, password change, sign-out, and an empty history. The navbar menu offered Meu Perfil and Sair. An unauthenticated DELETE returned 401. The page fit a 390px width. Edit and delete of a real row were not exercised because this account has no evaluations.

### [2026-10-16] — `SPRINT4-STEP2-PROFILE-MODAL-AND-UUID-FIX`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/perfil/password-modal.tsx` (CREATED)
  - `src/components/perfil/user-info.tsx` (MODIFIED)
  - `src/lib/auth/account-actions.ts` (MODIFIED)
  - `src/app/api/avaliacoes/route.ts` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** Email accounts now see an “Alterar senha” button. It opens a centered native dialog with the current password, the new password, and the confirmation. Zod still requires 8–72 characters and a matching confirmation. The server checks the current password with `signInWithPassword` before `updateUser`. Success shows “Senha alterada.” Errors stay in the dialog. The profile “Sair” button was removed; sign-out stays in the navbar. `POST /api/avaliacoes` accepts any 8-4-4-4-12 hex id, including `11111111-1111-1111-1111-111111111111`. `z.string().uuid()` was not used because Zod’s RFC check rejects those seed ids. Risk: this browser had no session, so the dialog was not opened on a signed-in account. `/perfil` redirected to `/login?next=/perfil`.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit` and `npm run build`. The seed ids and a version-4 id matched the new pattern; `not-a-uuid` did not.

### [2026-10-16] — `SPRINT4-STEP3-CENTER-PASSWORD-MODAL`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/perfil/password-modal.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** Tailwind’s reset removes the browser’s automatic dialog margin, so the password dialog sat at the top-left. The dialog is now the overlay: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm`. The form sits in a `w-full max-w-md` panel that scrolls inside the viewport. Backdrop click and Escape still close it, and `role="dialog"` plus `aria-modal="true"` stay in place. Risk: this browser has no signed-in session, so the open dialog was not measured on screen. `/perfil` redirected to `/login?next=/perfil`.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit` and `npm run build`.

### [2026-10-16] — `SPRINT4-STEP3-PASSWORD-MODAL-CLOSED`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/perfil/password-modal.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The password dialog opened with the profile because Tailwind’s `flex` utility sets `display: flex` and overrides the browser rule that hides a closed `<dialog>`. The overlay now stays hidden unless it has the `open` attribute, which `showModal()` adds only after “Alterar senha” is clicked. Escape, backdrop click, and the centered panel are unchanged. Risk: this browser has no signed-in session, so the click was not repeated on `/perfil`.
- **Compilation Status:** Validated with zero errors via `tsc --noEmit`.

### [2026-10-16] — `SPRINT4-STEP3-PASSWORD-MODAL-SPACING`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/perfil/password-modal.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The button row under “Confirmar nova senha” now adds `pt-4` on top of the form’s `space-y-4`, so “Alterar senha” and “Fechar” sit farther from the last field. A plain `mt-*` class would lose to `space-y-4`.
- **Compilation Status:** Class-only change.

### [2026-10-16] — `SPRINT4-STEP4-NAVBAR-PROFILE-BUTTON-REDESIGN`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/navbar.tsx` (MODIFIED)
  - `src/components/navbar-session.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The signed-in trigger is a rounded account control: first name on the left, a 36px circle on the right. Google `avatar_url` or `picture` (https only) fills the circle; a broken URL or a missing photo falls back to the uppercase first letter. Clicking toggles “Meu Perfil” and “Sair”; a click outside or Escape closes the menu. Below the `sm` breakpoint the menu aligns to the left edge of the button so it stays on screen. Risk: `public_profiles` has no avatar column, so the photo exists only in auth metadata.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit` and `npm run build`.

### [2026-10-16] — `SPRINT4-STEP5-CLEAN-HEADER-LAYOUT`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/navbar.tsx` (MODIFIED)
  - `src/components/navbar-session.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The header no longer renders the four sphere pills. The brand link stays on the left and the account menu on the right, in one row with `justify-between` and `px-4 sm:px-6 lg:px-8`. Sphere choices remain in the home hero and the search filter. The account menu now aligns to the right edge of the button on every width, because the button no longer wraps to the left. Risk: profile and representative pages have no header shortcut back to a sphere; the user returns home or uses search.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit` and `npm run build`.

### [2026-10-16] — `SPRINT4-STEP5-NAVBAR-HEADER-HARMONIZATION`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/navbar-session.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The account trigger and its menu now share `rounded-xl`, a slate border, the background surface, and `shadow-lg`. Menu items sit in `p-1.5 space-y-1`, with a user icon on “Meu Perfil” and a logout icon on “Sair”. The four sphere pills were already absent from the header; the brand stays left and the account control stays right. The avatar circle stays round inside the squared trigger. Risk: these slate classes are local to the account control, while the rest of the header still uses the theme tokens.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit` and `npm run build`.

### [2026-10-16] — `SPRINT4-STEP6-PROFILE-AVATAR-MANAGEMENT`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/perfil/avatar-manager.tsx` (CREATED)
  - `src/lib/auth/avatar-actions.ts` (CREATED)
  - `src/lib/auth/session-avatar.ts` (CREATED)
  - `supabase/avatars-storage.sql` (CREATED)
  - `src/components/perfil/user-info.tsx` (MODIFIED)
  - `src/app/perfil/page.tsx` (MODIFIED)
  - `src/components/navbar.tsx` (MODIFIED)
  - `src/components/navbar-session.tsx` (MODIFIED)
  - `next.config.ts` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The account card on `/perfil` shows the custom photo, the Google picture, or the initial. “Alterar foto” accepts PNG, JPEG, or WebP up to 2 MB, checks the file signature on the server, and stores the bytes in the `avatars` bucket. Only the https URL is written to `avatar_url`. A 2 MB image is not stored as base64 because auth metadata cannot hold it. “Remover foto” clears that URL and sets `avatar_removed`, so the letter fallback returns even when Google still has `picture`. With no photo the button is disabled and its title is “Função indisponível: você não possui uma foto cadastrada”. Saving shows a spinner and a status toast. The navbar listens for the new URL immediately. Risk: uploads fail until `supabase/avatars-storage.sql` is run in the SQL editor. Removing a photo was not clicked on the signed-in account.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit` and `npm run build`.

### [2026-10-16] — `SPRINT4-STEP7-PROFILE-LAYOUT-REDISTRIBUTION`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/perfil/user-info.tsx` (MODIFIED)
  - `src/components/perfil/avatar-manager.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The account section is one card. From the `md` breakpoint the avatar column sits beside a 2×2 grid: Nome, E-mail, Data de Cadastro, Tipo de Acesso. “Alterar senha” sits under that grid with a top border. Below `md` the avatar stacks above the fields, and the grid stays two columns. The circle is 80px, and 96px from `md` up, including height so it stays round. Photo actions and the disabled remove tooltip are unchanged. A Google account still shows the Google note in that same slot instead of the password button.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit` and `npm run build`.

### [2026-10-16] — `SPRINT4-STEP8-PROFILE-POLISH-AND-ACCOUNT-LINKING`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/perfil/email-modal.tsx` (CREATED)
  - `src/components/perfil/connected-accounts.tsx` (CREATED)
  - `src/lib/auth/identity-actions.ts` (CREATED)
  - `src/lib/auth/account-actions.ts` (MODIFIED)
  - `src/components/perfil/avatar-manager.tsx` (MODIFIED)
  - `src/components/perfil/user-info.tsx` (MODIFIED)
  - `src/components/perfil/password-modal.tsx` (MODIFIED)
  - `src/app/perfil/page.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The avatar column is centered over its buttons. Email accounts get matching outline buttons for “Alterar senha” and “Alterar e-mail”. The email dialog calls `updateUser({ email })` and tells the person to confirm the message sent to the new address. Supabase’s email-change flow is that confirmation, not the signup 6-digit screen. “Contas conectadas” shows Google as connected or not. Linking uses `linkIdentity` and returns through `/auth/callback`. Unlinking is refused when Google is the only identity, on the button and on the server. Risk: manual linking stays off until it is enabled in the Supabase dashboard, and the callback URL must stay on the redirect allow-list. The signed-in account already has email and Google, so “Desconectar” was enabled and was not clicked. No email change was sent.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit` and `npm run build`.

### [2026-10-17] — `INFRA-STEP1-VITEST-SETUP`
- **Status:** DONE
- **Files Created / Modified:**
  - `vitest.config.ts` (CREATED)
  - `src/tests/smoke.test.ts` (CREATED)
  - `package.json` (MODIFIED)
  - `package-lock.json` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** Vitest `4.1.12` is installed as a devDependency. `5.0.5` was rejected: it requires `@types/node` `^22` and `npm install` stopped with `ERESOLVE` against this repo’s `@types/node` `^20`. `4.1.12` is the latest stable line that still accepts Node 20 types and runs on the local Node `22.15.1`. `vitest.config.ts` maps `@` to `./src` and includes `src/**/*.test.ts` and `src/**/*.spec.ts` in the Node environment. Scripts are `test` (`vitest run`) and `test:watch` (`vitest`). The smoke test asserts a truthy value and imports `safeNextPath` through `@/`, so the alias is exercised. Risk: Vite warns that a future native config loader will not load this ESM `vitest.config.ts` while `package.json` stays CommonJS. The suite passes with the current loader. Setting `"type": "module"` was not done because that changes the whole Next.js package.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit`. `npm run test` passed 1 file and 1 test.

### [2026-10-17] — `INFRA-STEP2-ZOD-EVALUATION-SCHEMA`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/schemas/politicalEvaluation.schema.ts` (CREATED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `politicalEvaluationSchema` is a `z.strictObject`: `politicianId` is trimmed text of 1–64 characters, `rating` is an integer from 1 to 5, `category` is `transparencia | projetos | gestao | geral`, `comment` is optional and when present is trimmed text of 10–1000 characters, and `isAnonymous` defaults to `false`. `PoliticalEvaluation` is `z.infer` of that schema. Trim runs before the length checks, so a whitespace-only id fails. Unknown keys such as `role` fail. Numeric strings and half-star ratings fail. Risk: `user_evaluations` stores ten competency scores on `profile_id`, not this single rating, category, comment, or anonymity flag. This schema is not wired to `POST /api/avaliacoes`. HTML encoding stays at render time; no sanitizer package was added.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit`. A direct parse trimmed the id and comment, defaulted `isAnonymous` to false, and rejected an extra `role`, a blank id, a `4.5` rating, and a string rating.

### [2026-10-17] — `INFRA-STEP3-ZOD-SCHEMA-UNIT-TESTS`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/schemas/politicalEvaluation.schema.test.ts` (CREATED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The schema tests import `politicalEvaluationSchema` through `@/`. They accept a full payload (trimmed id and comment, explicit `isAnonymous: true`) and a minimal payload (`isAnonymous` defaults to `false`). They reject ratings `0`, `6`, and `4.5`, blank or whitespace-only ids, comments under 10 or over 1000 characters after trim, a category outside `transparencia | projetos | gestao | geral`, and an extra `role`. Comments of exactly 10 and 1000 characters after trim pass. `TASKS.md` had no Vertical Slice line, so that item was added already checked. Risk: these tests cover the isolated DTO, not the ten-score `POST /api/avaliacoes` body.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit`. `npm run test` passed 2 files and 13 tests, including `smoke.test.ts` and `politicalEvaluation.schema.test.ts`.

### [2026-10-17] — `INFRA-CHECKPOINT-SLICE-VERTICAL`
- **Status:** DONE
- **Files Created / Modified:**
  - `vitest.config.ts` (CREATED)
  - `src/tests/smoke.test.ts` (CREATED)
  - `src/schemas/politicalEvaluation.schema.ts` (CREATED)
  - `src/schemas/politicalEvaluation.schema.test.ts` (CREATED)
  - `package.json` (MODIFIED)
  - `package-lock.json` (MODIFIED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The vertical slice is checkpointed. `npx tsc --noEmit` exited 0 and `npm run test` passed 2 files and 13 tests. `REPORT.MD` already records the Vitest setup, the strict evaluation schema, and the unit-test results. `TASKS.md` marks “Vertical Slice setup and validation” as completed. Those files, plus `vitest.config.ts`, `src/tests/`, `src/schemas/`, `package.json`, and `package-lock.json`, are committed as `feat(infra): complete vertical slice with vitest and strict zod evaluation schema`. Risk: the schema still does not match the ten-score `user_evaluations` payload, and Vite still warns that a future native loader will not read the ESM config while `package.json` stays CommonJS.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit`. `npm run test` passed 2 files and 13 tests.

### [2026-10-19] — `INFRA-STEP4-AUTH-SESSION-GUARD`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/lib/auth/session-guard.ts` (CREATED)
  - `src/lib/auth/session-guard.test.ts` (CREATED)
  - `src/app/api/avaliacoes/route.ts` (MODIFIED)
  - `package.json` (MODIFIED)
  - `tsconfig.json` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `requireAuthSession` accepts only an object with a non-empty `user.id` and returns `{ userId, isAuthenticated: true }`. Anything else throws `UnauthorizedError` with code `UNAUTHORIZED`. POST `/api/avaliacoes` uses that result after `getUser()`. The guard does not check the token itself; Supabase still does that. The repo has no smoke or schema test files, so `npm run test` runs the three session-guard cases. DELETE `/api/avaliacoes/[id]` still checks `getUser()` on its own.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit` and `npm run test` (3 passed).

### [2026-10-19] — `INFRA-CHECKPOINT-AUTH-GUARD`
- **Status:** DONE
- **Files Created / Modified:**
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `REPORT.MD` already records `requireAuthSession` and its use on POST `/api/avaliacoes`. `TASKS.md` now marks the session guard and that backend authorization step as completed. Both are included in the commit `feat(auth): require a validated session before saving an evaluation`.
- **Compilation Status:** Documentation and git checkpoint. No new application code.

### [2026-10-19] — `INFRA-STEP5-API-INTEGRATION-TESTS`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/app/api/avaliacoes/route.test.ts` (CREATED)
  - `src/schemas/politicalEvaluation.schema.ts` (CREATED)
  - `src/schemas/politicalEvaluation.schema.test.ts` (CREATED)
  - `src/app/api/avaliacoes/route.ts` (MODIFIED)
  - `src/lib/auth/session-guard.test.ts` (MODIFIED)
  - `vitest.config.ts` (CREATED)
  - `package.json` (MODIFIED)
  - `package-lock.json` (MODIFIED)
  - `tsconfig.json` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** POST `/api/avaliacoes` now validates with `politicalEvaluationSchema`. Vitest 3.2.7 covers the session guard, the schema, and the route: missing or invalid sessions return 401, invalid payloads return 400, and a valid payload returns 201 on insert and 200 on update. Turnstile and persistence are mocked. `npx tsc --noEmit` and `npm run test` passed (8 tests).
- **Compilation Status:** `npx tsc --noEmit` exited 0. `npm run test` (Vitest 3.2.7) passed 8 tests across session guard, schema, and API integration. Vitest 5 conflicts with `@types/node` 20; Vitest 4 crashed npm's installer, so the suite stays on the stable 3.2.7 line. No standalone smoke file exists.

### [2026-10-19] — `INFRA-CHECKPOINT-API-TESTS`
- **Status:** DONE
- **Files Created / Modified:**
  - `TASKS.md` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** `REPORT.md` records the Vitest suite for POST `/api/avaliacoes` and the passing `tsc` and `npm run test` results (8 tests). `TASKS.md` marks that API integration coverage as completed in `932a6f7`, message `test(api): cover POST /api/avaliacoes session, validation, and status codes`.
- **Compilation Status:** Documentation and git checkpoint. No new application code.

### [2026-10-19] — `FRONTEND-STEP1-NAV-REORG`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/home/sphere-selection.tsx` (CREATED)
  - `src/components/home/hero-search.tsx` (MODIFIED)
  - `src/components/home/sphere-modals.tsx` (MODIFIED)
  - `src/app/page.tsx` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** The home search no longer shows “Em alta” or the static sphere pills. One `activeSphere` state drives the Política, Judiciário, Academia, and Segurança tabs directly under the search bar, and the sphere card below follows that selection. At 420px the tabs wrap to two columns; at 1280px they sit in one row the same width as the search. `npx tsc --noEmit` and `npm run test` passed (8 tests).
- **Compilation Status:** `npx tsc --noEmit` exited 0. `npm run test` passed 8 tests. Browser check on `/` confirmed the Judiciário tab updates the card and hash without changing the featured carousel. The name shortcuts under “Em alta” are gone. Featured carousel overflow at 420px and the existing GemBadge hydration warning were already present.

### [2026-10-19] — `FRONTEND-STEP2-SPHERE-CARD-INTEGRATION`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/home/sphere-modals.tsx` (MODIFIED)
  - `src/components/home/hero-search.tsx` (MODIFIED)
  - `src/components/home/sphere-selection.tsx` (MODIFIED)
  - `src/app/page.tsx` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** The active sphere now has one explanatory card directly under the tabs: title, scope, coverage indicators, and the search filter link. The lower “As 4 esferas” block is gone, so metrics and featured representatives follow that card. Switching Política, Judiciário, Academia, and Segurança replaces the card content. `npx tsc --noEmit` and `npm run test` passed (8 tests).
- **Compilation Status:** `npx tsc --noEmit` exited 0. `npm run test` passed 8 tests. On `/` at 435px, the card sits 16px under the tabs and above “Estatísticas do Monitoramento”. Academia and Segurança updated the same card. The featured strip still has its own sphere filter. The GemBadge hydration warning was already present.

### [2026-10-19] — `FRONTEND-STEP3-CAROUSEL-AUTOPLAY`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/home/featured-carousel.tsx` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** The featured representatives track advances one card every 5 seconds and returns to the first card at the end. The interval is cleared on cleanup, while the pointer is over the track, and while focus stays inside it. A manual previous or next click starts the 5-second clock over. Auto-play stays off when the system requests reduced motion. `npx tsc --noEmit` and `npm run test` passed (8 tests).
- **Compilation Status:** `npx tsc --noEmit` exited 0. `npm run test` passed 8 tests. On `/` at 435px the track moved from 404px to 808px within one interval, and it stayed put for 7 seconds while the next control was focused.

### [2026-10-19] — `FRONTEND-STEP4-HERO-SEARCH-AND-LAYOUT-HIERARCHY`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/home/hero-search.tsx` (MODIFIED)
  - `src/components/home/sphere-selection.tsx` (MODIFIED)
  - `src/components/home/featured-carousel.tsx` (MODIFIED)
  - `src/app/page.tsx` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** The home hero is title, subtitle, and the search bar. The four metric cards sit directly under it. Sphere tabs and the explanation card are the header of “Representantes em Destaque”, and the same `activeSphere` updates that card and the carousel. `npx tsc --noEmit` and `npm run test` passed (8 tests).
- **Compilation Status:** `npx tsc --noEmit` exited 0. `npm run test` passed 8 tests. At 1280×800 the metric cards end at 544px, inside an 800px viewport. Selecting Judiciário switched the card, the “Ver mais” link, and the profiles to Ricardo Mendonça, Helena Prado, and Lúcia Ferreira. `/busca` still lists representatives, so the search placeholder was not widened to articles or publications.

### [2026-10-19] — `FRONTEND-STEP1-EVALUATION-MODAL-UI`
- **Status:** PARTIAL
- **Files Created / Modified:**
  - `src/components/evaluations/evaluation-modal.tsx` (CREATED)
  - `REPORT.md` (MODIFIED)
- **Summary:** The new evaluation dialog shows the politician’s name, photo or initial, and role, then ten 1–5 score groups validated by `politicalEvaluationSchema`. A missing score shows “Escolha uma nota de 1 a 5.” after that group loses focus. Submit stays disabled until every score is valid, and stays disabled while `onSubmit` is running. `npx tsc --noEmit` and `npm run test` passed (8 tests).
- **Compilation Status:** `npx tsc --noEmit` exited 0. `npm run test` passed 8 tests. Category, comment, and anonymity were not added: they are not in `politicalEvaluationSchema` or `user_evaluations`. The referenced mockup is a profile card, not that form. The dialog is not mounted; the profile page still uses the questionnaire that checks the session and Turnstile. The new dialog was not opened in the browser.

### [2026-10-19] — `FRONTEND-STEP2-EVALUATION-MODAL-INTEGRATION`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/evaluations/evaluation-panel.tsx` (CREATED)
  - `src/components/evaluations/evaluation-modal.tsx` (MODIFIED)
  - `src/app/politicos/[id]/page.tsx` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** The politician page mounts the evaluation dialog behind an “Avaliar” button and passes the profile id, name, and role. Submit posts the ten scores to `POST /api/avaliacoes`. Success closes the dialog, shows a notice, and refreshes the page. A 401 opens the login dialog. A 400 or other error stays in the dialog with the API message. `npx tsc --noEmit` and `npm run test` passed (8 tests).
- **Compilation Status:** `npx tsc --noEmit` exited 0. `npm run test` passed 8 tests. On Mariana Silva’s profile, “Avaliar” opened the dialog with her name and role, “Enviar avaliação” was disabled, and Fechar closed it. No evaluation was posted. `public_profiles` has no photo column, so the header uses the initial. Saving an evaluation does not recompute the stored carisma or gestão figures. Turnstile still rides along with the request.

### [2026-10-19] — `FRONTEND-CHECKPOINT-EVALUATION-MODAL`
- **Status:** DONE
- **Files Created / Modified:**
  - `TASKS.md` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** `REPORT.md` records `EvaluationModal`, its mount from the politician page through `EvaluationPanel`, and the submit path to POST `/api/avaliacoes`. `TASKS.md` marks the modal UI and that page integration as completed in `e65c2e7`, message `feat(evaluations): mount interactive evaluation modal on politician detail page`. The component files were already in `d245afd`.
- **Compilation Status:** Documentation and git checkpoint. No new application code.

### [2026-10-19] — `BACKEND-STEP1-SUPABASE-METRICS-AGGREGATION`
- **Status:** DONE
- **Files Created / Modified:**
  - `supabase/migrations/20261019_recalculate_profile_scores.sql` (CREATED)
  - `src/app/api/avaliacoes/route.ts` (MODIFIED)
  - `src/app/api/avaliacoes/route.test.ts` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** `recalculate_profile_scores(target_profile_id)` sets `carisma_rating` to the mean of the ten stored scores, or `0.00` when that profile has no evaluations. POST `/api/avaliacoes` calls the RPC after a successful save. An RPC error is logged and the 200/201 response is unchanged. `npx tsc --noEmit` exited 0. `npm run test` passed 9 tests.
- **Compilation Status:** `npx tsc --noEmit` exited 0. `npm run test` passed 9 tests. `gestao_score` stays the official index and is not overwritten. There is no column for a separate transparency average or an overall score. The function is `SECURITY DEFINER` with `search_path = public`, and execute is granted to `authenticated` and `service_role`. The SQL file is not applied to the live database until it is run in the Supabase SQL editor.

### [2026-10-19] — `BACKEND-CHECKPOINT-SUPABASE-METRICS`
- **Status:** DONE
- **Files Created / Modified:**
  - `TASKS.md` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** `REPORT.md` records `supabase/migrations/20261019_recalculate_profile_scores.sql` and the `recalculate_profile_scores` call in POST `/api/avaliacoes`. `TASKS.md` marks that automated recalculation as completed. The SQL, route, and route test were already committed in `c05f482`.
- **Compilation Status:** Documentation and git checkpoint. No new application code.

### [2026-10-19] — `FRONTEND-STEP1-SEARCH-PAGE-LAYOUT`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/busca/search-category-tabs.tsx` (CREATED)
  - `src/components/busca/search-filters.tsx` (MODIFIED)
  - `src/app/busca/page.tsx` (MODIFIED)
  - `src/app/busca/loading.tsx` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** `/busca` keeps the query in the search field and reads `q`, `categoria`, `sphere`, and `status`. Tabs for Todos, Políticos & Representantes, Votações & Pautas, and Publicações & Documentos update `categoria` with `router.replace`. Representatives still come from `getPublicProfiles`. The other two categories render an empty state because they have no search index. `npx tsc --noEmit` exited 0. `npm run test` passed 9 tests.
- **Compilation Status:** `npx tsc --noEmit` exited 0. `npm run test` passed 9 tests. On `/busca?q=Mariana&categoria=todos` the heading was “Resultados da busca para: Mariana”, the field held Mariana, and Mariana Silva was listed. Switching to Votações and then Publicações changed the URL without a full reload and left only that section’s empty state. `/busca?sphere=JUDICIARIO` still lists Helena Prado, Ricardo Mendonça, and Lúcia Ferreira. The home samples of votações were not reused as search hits.

### [2026-10-19] — `FRONTEND-STEP2-SEARCH-DATA-INTEGRATION`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/lib/search/catalog.ts` (CREATED)
  - `src/lib/search/catalog.test.ts` (CREATED)
  - `src/components/busca/search-result-cards.tsx` (CREATED)
  - `src/lib/services/profiles.ts` (MODIFIED)
  - `src/app/busca/page.tsx` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** `/busca` matches representatives by `name` and `current_role`. Votações and publicações come from a local catalog filtered by `q`, with a count on each section. `npx tsc --noEmit` exited 0. `npm run test` passed 12 tests.
- **Compilation Status:** `npx tsc --noEmit` exited 0. `npm run test` passed 12 tests. `public_profiles` has no party or state column, so those fields are not queried. There is no votings or publications table, so those cards are labeled as an illustrative catalog. `q=Mariana` listed Mariana Silva and left the other sections empty. `q=PEC` showed PEC 45/2025 and PEC 12/2026. `q=transparencia` showed the emendas report with the Câmara link. `q=Desembargadora` found Helena Prado by role.

### [2026-10-19] — `FRONTEND-CHECKPOINT-SEARCH-PAGE`
- **Status:** DONE
- **Files Created / Modified:**
  - `TASKS.md` (MODIFIED)
  - `REPORT.md` (MODIFIED)
- **Summary:** `REPORT.md` records `src/lib/search/catalog.ts`, the voting and publication cards, and the `/busca` page with URL sync. `TASKS.md` marks Option B (Global Search Page) as completed. The search files are included in the commit `feat(search): implement multi-category global search with URL sync and mock catalog`.
- **Compilation Status:** Documentation and git checkpoint. No new application code.

### [2026-10-19] — `SYNC-ORIGIN-MAIN`
- **Status:** DONE
- **Files Created / Modified:**
  - `package.json` (MODIFIED)
  - `package-lock.json` (MODIFIED)
  - `vitest.config.ts` (MODIFIED)
  - `src/schemas/politicalEvaluation.schema.ts` (MODIFIED)
  - `src/schemas/politicalEvaluation.schema.test.ts` (MODIFIED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** Local `main` was 1 commit ahead and 12 behind `origin/main` (`fed5bf8`). The merge keeps the GitHub evaluation contract: `profileId`, ten star scores, and an optional Turnstile token. The earlier local DTO (`politicianId`, one rating, category, comment, `isAnonymous`) was not wired to `POST /api/avaliacoes` and would have broken the modal. Vitest stays at `3.2.7`, which is the version on GitHub, and `test:watch` remains. `TASKS.md` keeps Sprints 4–8 and the completed vertical-slice line. `npx tsc --noEmit` exited 0. `npm run test` passed 5 files and 13 tests. `npm run build` completed on Next.js 15.5.27 with 15 dynamic routes.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit`, `npm run test` (13 tests), and `npm run build`.

### [2026-10-19] — `FRONTEND-STEP1-NEWS-VOTINGS-HUB`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/app/votacoes/page.tsx` (CREATED)
  - `src/components/votacoes/progress-timeline.tsx` (CREATED)
  - `src/components/votacoes/voting-card.tsx` (CREATED)
  - `src/lib/search/catalog.ts` (MODIFIED)
  - `src/lib/search/catalog.test.ts` (MODIFIED)
  - `src/components/busca/search-result-cards.tsx` (MODIFIED)
  - `src/components/navbar.tsx` (MODIFIED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `/votacoes` lists the same illustrative catalog used by `/busca`, now with five items and the statuses Em Pauta, Em Discussão, Em Votação, Aprovadas, and Revogadas. The status query is checked with Zod; an unknown value shows every item. Each card shows the code, title, summary, rapporteur, a four-step timeline with the current stage and dates, and a favor/against/abstention bar when a tally exists. Items still in committee or floor debate say the vote has not started. Session links go to `https://www.camara.leg.br/tv` or `https://www.senado.leg.br/tv`. The navbar links to Votações. Risk: the tallies and dates are catalog data, not a live Câmara or Senado feed. `PEC 45/2019` was not used; the existing illustrative code remains `PEC 45/2025`.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit`. `npm run test` passed 5 files and 14 tests. `/votacoes` listed 5 tramitações. `?status=Aprovadas` kept PEC 45/2025 with 312 votes a favor. `?status=Em Votação` kept PEC 3/2026. `?status=admin` kept Todas and the 5 items. `/busca?categoria=votacoes&q=pec 45` still listed PEC 45/2025. At 390px the page scroll width matched the viewport.

### [2026-10-19] — `FRONTEND-CHECKPOINT-NEWS-VOTINGS-HUB`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/app/votacoes/page.tsx` (CREATED)
  - `src/components/votacoes/progress-timeline.tsx` (CREATED)
  - `src/components/votacoes/voting-card.tsx` (CREATED)
  - `src/lib/search/catalog.ts` (MODIFIED)
  - `src/lib/search/catalog.test.ts` (MODIFIED)
  - `src/components/busca/search-result-cards.tsx` (MODIFIED)
  - `src/components/navbar.tsx` (MODIFIED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `REPORT.MD` records `/votacoes`, `progress-timeline.tsx`, and `voting-card.tsx`. `TASKS.md` marks Legislative Hub & Voting Timeline as completed. Those files, plus the catalog, the search card, and the navbar link, are committed as `feat(votacoes): add legislative hub with timeline and vote breakdown`.
- **Compilation Status:** Documentation and git checkpoint. The typecheck and the 14 tests were already green in `FRONTEND-STEP1-NEWS-VOTINGS-HUB`.

### [2026-10-19] — `FRONTEND-STEP2-POLITICIAN-VOTING-INTEGRATION`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/politicos/voting-positions.tsx` (CREATED)
  - `src/components/votacoes/voter-disclosure.tsx` (CREATED)
  - `src/components/votacoes/vote-badge.tsx` (CREATED)
  - `src/app/politicos/[id]/page.tsx` (MODIFIED)
  - `src/components/votacoes/voting-card.tsx` (MODIFIED)
  - `src/lib/search/catalog.ts` (MODIFIED)
  - `src/lib/search/catalog.test.ts` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** The profile page section “Votações e Posicionamentos” lists the catalog bills for that profile with code, title, date, and the badge A favor, Contra, or Abstenção. The three political seed profiles are the only linked voters. Bills still in committee or debate have no nominal list. On a voted bill, “Ver posicionamentos” expands the names and initial avatars, each linking to `/politicos/[id]`. The plenary bar stays the illustrative total. Searching “mariana” still returns no voting row, so the search test stays intact. Risk: these positions are catalog data, not a roll call from the Câmara or the Senado. A rapporteur name that is not a seed profile stays plain text.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit`. `npm run test` passed 5 files and 15 tests. The political seed profile listed PEC 3/2026 as Contra, PEC 45/2025 as A favor, and PL 88/2024 as Abstenção. A judiciary profile showed “Nenhuma votação registrada para este perfil.” On PEC 45/2025 the disclosure opened Mariana Silva, Ana Beatriz, and Carlos Eduardo, and the first link opened that profile. Em Pauta kept “Votação ainda não iniciada.”

### [2026-10-19] — `FRONTEND-CHECKPOINT-POLITICIAN-VOTING`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/components/politicos/voting-positions.tsx` (CREATED)
  - `src/components/votacoes/voter-disclosure.tsx` (CREATED)
  - `src/components/votacoes/vote-badge.tsx` (CREATED)
  - `src/app/politicos/[id]/page.tsx` (MODIFIED)
  - `src/components/votacoes/voting-card.tsx` (MODIFIED)
  - `src/lib/search/catalog.ts` (MODIFIED)
  - `src/lib/search/catalog.test.ts` (MODIFIED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `REPORT.MD` records `voting-positions.tsx`, `voter-disclosure.tsx`, `vote-badge.tsx`, and the profile page section. `TASKS.md` marks Politician Profile Voting Integration as completed. Those files are committed as `feat(votacoes): link politician votes to profile pages`.
- **Compilation Status:** Documentation and git checkpoint. The typecheck and the 15 tests were already green in `FRONTEND-STEP2-POLITICIAN-VOTING-INTEGRATION`.

### [2026-10-19] — `INFRA-CHECKPOINT-GIT-PUSH`
- **Status:** DONE
- **Files Created / Modified:**
  - `REPORT.MD` (MODIFIED)
- **Summary:** `git push origin main` updated `https://github.com/Rissho-Labs/saber-brasil.git` from `fed5bf8` to `8adec45`. The four local commits were `80eae75` (Vitest and the strict evaluation schema), `87c5aa2` (merge of the remote search and evaluation work), `6bc3161` (legislative hub), and `8adec45` (profile voting links). `HEAD` and `origin/main` are both `8adec45fce8cc7a0b4e960ff4113ef605125add6`. This report line stays local so the pushed history is not rewritten.
- **Compilation Status:** Git synchronization. No application code changed.

### [2026-10-19] — `FRONTEND-STEP1-PUBLIC-INDICATORS-HUB`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/app/indicadores/page.tsx` (CREATED)
  - `src/components/indicadores/indicator-card.tsx` (CREATED)
  - `src/components/indicadores/indicator-compare.tsx` (CREATED)
  - `src/lib/indicadores/catalog.ts` (CREATED)
  - `src/lib/indicadores/catalog.test.ts` (CREATED)
  - `src/components/navbar.tsx` (MODIFIED)
  - `src/components/home/kpi-stats.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `/indicadores` lists an illustrative catalog with the tabs Todos, Meio Ambiente & Clima, Infraestrutura & Saneamento, Trabalho & Economia, and Gestão Pública & Transparência. Zod rejects an unknown `categoria` and the page then shows Todos. Each card shows the value, the trend against the previous year, the update date, and the badges Fonte Pública Oficial and, when an independent reading exists, Auditoria / Terceiro Setor. “Comparar fontes” opens the official figure beside the third-party figure. Water, inflation, and parliamentary attendance have no third-party row. The navbar links to Indicadores. The home metrics section gained “Veja mais” to `/indicadores`; the featured carousel “Ver mais” still filters `/busca` by sphere. Risk: the numbers are catalog samples, not live IBGE, INPE, DATASUS, or Portal da Transparência feeds.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit`. `npm run test` passed 6 files and 18 tests. Home “Veja mais” opened `/indicadores` with 8 cards. `?categoria=ambiente` kept queimadas and desmatamento. The queimadas contrast showed INPE 12.400 and MapBiomas 11.900. `?categoria=admin` kept Todos. Água potável showed only Fonte Pública Oficial. At 390px the page scroll width matched the viewport.

### [2026-10-19] — `FRONTEND-CHECKPOINT-PUBLIC-INDICATORS`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/app/indicadores/page.tsx` (CREATED)
  - `src/components/indicadores/indicator-card.tsx` (CREATED)
  - `src/components/indicadores/indicator-compare.tsx` (CREATED)
  - `src/lib/indicadores/catalog.ts` (CREATED)
  - `src/lib/indicadores/catalog.test.ts` (CREATED)
  - `src/components/navbar.tsx` (MODIFIED)
  - `src/components/home/kpi-stats.tsx` (MODIFIED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `REPORT.MD` records `/indicadores`, `indicator-card.tsx`, `indicator-compare.tsx`, and `catalog.ts`. `TASKS.md` marks Public Indicators Hub and Source Contrast as completed. Those files, plus the catalog test, the navbar link, and the home “Veja mais” link, are committed as `feat(indicadores): add public indicators hub with source contrast`.
- **Compilation Status:** Documentation and git checkpoint. The typecheck and the 18 tests were already green in `FRONTEND-STEP1-PUBLIC-INDICATORS-HUB`.

### [2026-10-19] — `FRONTEND-STEP1-DEDICATED-SPHERE-PAGES`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/app/esferas/[slug]/page.tsx` (CREATED)
  - `src/lib/esferas/catalog.ts` (CREATED)
  - `src/lib/esferas/catalog.test.ts` (CREATED)
  - `src/lib/search/catalog.ts` (MODIFIED)
  - `src/components/home/sphere-modals.tsx` (MODIFIED)
  - `src/components/home/featured-carousel.tsx` (MODIFIED)
  - `src/components/busca/search-filters.tsx` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `/esferas/[slug]` covers `politica`, `judiciario`, `academia`, and `seguranca`. An unknown slug returns 404. Each page shows the title, emoji badge, institutional description, and coverage list. Representatives come from `public_profiles` filtered by sphere and link to `/politicos/[id]`. Legislative catalog rows now carry a `sphere`; Política lists them and the other spheres show an empty tramitação state. Política highlights assiduidade and execução orçamentária; Segurança highlights queimadas and desmatamento. The home SphereCard and the featured “Ver detalhes da esfera” open `/esferas/[slug]`. Search filters keep the sphere select for `/busca` and add links to each sphere page. Risk: votings and indicators remain illustrative catalogs, not live House or INPE feeds.
- **Compilation Status:** Validated with zero errors via `npx tsc --noEmit`. `npm run test` passed 7 files and 20 tests. `/esferas/politica` listed three political profiles, five tramitações, and two indicators. `/esferas/seguranca` listed security profiles, no tramitações, and queimadas/desmatamento. `/esferas/admin` returned 404.

### [2026-10-19] — `FRONTEND-CHECKPOINT-DEDICATED-SPHERE-PAGES`
- **Status:** DONE
- **Files Created / Modified:**
  - `src/app/esferas/[slug]/page.tsx` (CREATED)
  - `src/lib/esferas/catalog.ts` (CREATED)
  - `src/lib/esferas/catalog.test.ts` (CREATED)
  - `src/lib/search/catalog.ts` (MODIFIED)
  - `src/components/home/sphere-modals.tsx` (MODIFIED)
  - `src/components/home/featured-carousel.tsx` (MODIFIED)
  - `src/components/busca/search-filters.tsx` (MODIFIED)
  - `TASKS.md` (MODIFIED)
  - `REPORT.MD` (MODIFIED)
- **Summary:** `REPORT.MD` records `/esferas/[slug]`, `src/lib/esferas/catalog.ts`, and the updates to `sphere-modals.tsx` and search filters. `TASKS.md` marks Dedicated Sphere Pages (/esferas/[slug]) as completed. Those files are committed as `feat(esferas): add dedicated institutional sphere pages`.
- **Compilation Status:** Documentation and git checkpoint. The typecheck and the 20 tests were already green in `FRONTEND-STEP1-DEDICATED-SPHERE-PAGES`.
