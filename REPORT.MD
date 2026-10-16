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