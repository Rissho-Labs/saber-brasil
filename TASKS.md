# TASKS.md — Active Development Sprint

## SPRINT 1: Environment Setup & Base Structure
- [x] Initialize Next.js project (TypeScript, Tailwind CSS, App Router) on an LTS/stable release
- [x] Configure component library (Shadcn/ui and Lucide Icons)
- [x] Create project folder structure (`/src/app`, `/src/components`, `/src/lib`, `/src/types`)
- [x] Implement initial Navbar with SABER Brasil name and slogan
- [x] Create TypeScript types file (`/src/types/index.ts`) reflecting the `ARCHITECTURE.md` schema

## SPRINT 2: Home Screen & 4-Sphere Modals
- [x] Create the 4 Home Page Modal components (Politics, Judiciary, Academia, Safety)
- [x] Configure main search bar with sphere filters
- [x] Implement Profile Card component with colored borders (Green, Blue, Light Gray, Dark Gray)

## SPRINT 3: Politician Profile & Dual Score
- [x] Build Dual Score graphic view (Subjective Rating + Management Index)
- [x] Create 10-Question Questionnaire modal with pedagogical icons (`ℹ️`)
- [x] Create Gem visual component (Diamond, Platinum, Gold, Silver, Bronze) for Top 10 Agendas

## SPRINT 4: Auth session guard
- [x] Session guard: `requireAuthSession` returns a sanitized user id or throws `UNAUTHORIZED`
- [x] Backend authorization: POST `/api/avaliacoes` saves an evaluation only after that guard

## SPRINT 5: API integration tests
- [x] Vitest coverage for POST `/api/avaliacoes`: 401 missing session, 400 invalid payload, 201 insert, 200 update

## SPRINT 6: Politician evaluation modal
- [x] Politician Evaluation Modal UI: dialog with the politician header and ten scores validated by `politicalEvaluationSchema`
- [x] Politician Evaluation Modal integration: mount on the profile page and submit to POST `/api/avaliacoes`

## SPRINT 7: Profile metrics recalculation
- [x] Automated profile metrics recalculation: `recalculate_profile_scores` updates `carisma_rating` and POST `/api/avaliacoes` calls it after a successful save

---
**AI Instruction:** Execute ONLY one unchecked task at a time. After completing and testing without errors, mark the box `[x]`.
