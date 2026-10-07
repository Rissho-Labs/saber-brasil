# SABER Brasil — System Architecture & Technical Memory

> **Slogan:** Transparência real para quem quer decidir.
> **Organization:** Rissho Labs
> **Repository:** rissholabs/saber-brasil

---

## 1. Overview & Purpose
**SABER Brasil** (Sistema de Acompanhamento da Burocracia e Evolução da República) is an impartial civic platform for open-data transparency, auditability, and public participation. Its core goal is to turn opaque government data into structured knowledge so citizens can evaluate representatives and public bodies without ideological bias or disinformation.

---

## 2. The 4 Coverage Spheres (Primary Modals)
Initial navigation and profiles are segmented into four institutional pillars:

1. **🏛️ Politics (Executive & Legislative):** Mayors, Governors, President, City Councilors, Deputies, and Senators.
2. **⚖️ Judiciary & Oversight:** Judges, Appellate Judges, Justices (STF, STJ, TSE), and Magistrates.
3. **🎓 Academia & Public Management:** Rectors, Faculty, Public University Administrators, Public Notices, and Entrance Exams.
4. **🛡️ Public Safety & Defense:** Police Commanders, Chief Delegates, Security Secretaries, and Operational Leadership.

---

## 3. Evaluation Model & Metrics

### 3.1. Dual Profile Score
Each profile is governed by two independent scoring systems:

* **Subjective Rating (1.0 to 5.0 Stars):** Computed via a Competency Questionnaire (10 questions on posture, decorum, discursive coherence, and articulation). Accompanied by pedagogical modals (`ℹ️`) explaining each criterion.
* **Weighted Management Index (0 to 100 Points):** Objective algorithmic metric based on official government data:
  `Index = Attendance (20%) + TSE Coherence (30%) + Cross Impact (50%)`

### 3.2. Cross Weighting (Institutional Weight vs. Citizen Weight)
* **Institutional Weight:** Urgency/relevance assigned by the Legislative House or Agency.
* **Citizen Weight:** Relevance assigned by the SABER Brasil community.
* **Divergence Index:** Visually exposes when Brasília prioritizes agendas contrary to direct popular interest.

### 3.3. Gem Gamification (Top 10 Agendas)
Representative activity is tagged with hashtags (e.g. `#Saúde`, `#Educação`, `#Segurança`). The 10 most active agendas earn colored badges by real execution relevance:
* 💎 **Diamond (Master Level)**
* ⚪ **Platinum**
* 🟡 **Gold**
* ⚪ **Silver**
* 🟤 **Bronze**

---

## 4. Visual Status & Integrity Matrix

### Activity Status (Border & Colors)
* 🟢 **Green (Active):** Currently holding an active public office/role.
* 🔵 **Blue (Candidate):** Registered and contesting an elective office.
* ⚪ **Light Gray (Inactive / Out of Office):** Former officeholder or manager with no current mandate (history preserved).
* ⚫ **Dark Gray (Closed / Terminated):** Profile permanently closed (e.g. deceased).

### Integrity & Legal Situation Badges
* 🟡 **Under Investigation:** Official inquiry or case open (linked to primary source).
* 🟠 **Impeached / Ineligible:** Loss of mandate or Ficha Limpa Law disposition.
* 🔴 **Imprisoned / Convicted:** Collegiate decision or final judgment (trânsito em julgado).

---

## 5. Forum, Dialogue & Citizen Proposals
* **No Personal Comments on Profiles:** Representative profiles contain only metrics, statistics, and the questionnaire.
* **Forum per Project/Agenda:** Restricted space for debate on specific works, laws, and budgets.
* **Attention Alerts:** Fast signals about local problems.
* **Formal Proposals:** Digital Popular Initiative projects with optional parliamentary adoption.

---

## 6. Technology Stack & Architecture

* **Frontend:** Next.js (LTS / App Router), TypeScript (Strict Mode), Tailwind CSS, Lucide Icons, Shadcn/ui.
* **Backend & Database:** Supabase (PostgreSQL, Auth, Storage, Row Level Security — RLS).
* **Data Integrations (APIs):** Portal da Transparência, Dados Abertos (Câmara/Senado), Google Gemini API.
* **Stability:** LTS and stable ecosystem dependencies only.
* **Source layout:** `/src/app`, `/src/components`, `/src/lib`, `/src/types`.

---

## 7. Simplified Database Schema (ER)

```sql
-- Spheres
CREATE TYPE sphere_type AS ENUM ('POLITICA', 'JUDICIARIO', 'ACADEMIA', 'SEGURANCA');
CREATE TYPE profile_status AS ENUM ('ATIVO', 'CANDIDATO', 'INATIVO', 'ENCERRADO');
CREATE TYPE alert_badge AS ENUM ('NENHUM', 'INVESTIGADO', 'CASSADO', 'CONDENADO');

-- Primary public entity/profile table
CREATE TABLE public_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sphere sphere_type NOT NULL,
  current_role VARCHAR(150),
  status profile_status DEFAULT 'ATIVO',
  badge alert_badge DEFAULT 'NENHUM',
  carisma_rating DECIMAL(3,2) DEFAULT 0.00,
  gestao_score INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Actions and projects table
CREATE TABLE public_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public_profiles(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  institutional_weight INT CHECK (institutional_weight BETWEEN 1 AND 5),
  citizen_weight INT CHECK (citizen_weight BETWEEN 1 AND 5),
  status VARCHAR(50),
  source_url TEXT NOT NULL
);

-- Evaluations table (10-question questionnaire)
CREATE TABLE user_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  profile_id UUID REFERENCES public_profiles(id),
  scores JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, profile_id)
);
```

## 8. Development Guidelines (Lego Methodology & Restore Point)
1. **Modular Development (Lego):** Build component by component. Never attempt full flows in a single instruction.
2. **Root-Cause Investigation (No Band-Aids):** On errors, inspect browser DevTools console logs and the terminal. Fix the real technical origin instead of applying superficial workarounds.
3. **Restore & Commits (Checkpoints):** Every feature tested and fully approved must produce a commit (`git commit`). If an error persists after more than 2 attempts, revert to the previous commit (`git checkout`) and change the solution approach.
4. **Extreme Context Economy:** The AI must read only `TASKS.md` for the next sprint step, avoiding full-repository re-reads on every interaction.
5. **LTS Stability:** Strictly prefer LTS/stable packages (Next.js, Node, TypeScript). Beta, canary, or bleeding-edge dependencies are forbidden.
