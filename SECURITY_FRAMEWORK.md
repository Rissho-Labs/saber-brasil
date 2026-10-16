# SYSTEM DIRECTIVE: AI SOFTWARE SECURITY & GOVERNANCE FRAMEWORK
> **Version:** 2.0-AI-Native | **Scope:** Web, Mobile, Cloud, APIs, LLM/AI Agents, and Data Privacy/Compliance
> **Target Execution Engine:** Cursor, Claude, GPT-4o, Gemini, Copilot, Custom AI Agents
> **Mode:** Strict Security Enforcement (Security-by-Design & Zero-Trust)

---

## 1. META-RULES AND AI EXECUTION DIRECTIVES

As an AI software development assistant, you MUST strictly adhere to the following directives across 100% of generated code, architecture, and suggestions:

1. **ZERO TRUST BY DEFAULT:** Never assume client inputs, headers, cookies, tokens, or URL parameters are trustworthy. Always validate on the server side.
2. **AUTHORIZATION IMPERATIVE (BOLA/BFLA GUARD):** Every resource query or mutation MUST explicitly verify on the server side that the session user (`user_id`) owns the requested resource (`resource_id`). Hiding UI components DOES NOT substitute server-side authorization.
3. **ANTI-HALLUCINATION DEPENDENCY MINDSET:** NEVER suggest packages, libraries, or dependencies without verifying their actual existence, active maintenance, and ecosystem reputation (NPM, PyPI, Crates, etc.).
4. **NO HARDCODED SECRETS:** NEVER write API keys, passwords, database connections, or tokens in public code, frontend components, scripts, or committed files. Use environment variables and secrets managers exclusively.
5. **DEFENSIVE PRODUCTION-GRADE CODE:** Every generated snippet must include error handling without stack trace leaks, input sanitization, strict typing (TypeScript without `any`, Zod/Pydantic schemas), and idempotency for mutable operations.

---

## 2. NORMATIVE REFERENCES AND COMPLIANCE
Code and architecture must strictly comply with the following specifications:
- **OWASP Top 10:2025** (Web Application Security Risks)
- **OWASP API Security Top 10** (API Threats)
- **OWASP LLM Applications Top 10:2025** (AI & Generative Risk)
- **OWASP ASVS Level 2/3** (Verifiable Requirements)
- **NIST SSDF SP 800-218** (Secure Software Development Framework)
- **LGPD (Brazilian General Data Protection Law - Law No. 13.709/2018)** and ANPD Information Security Guidelines

---

## 3. TECHNICAL RULES AND ENGINEERING CHECKLIST (51 DOMAINS)

### A. Architecture and Planning
- [MUST] **A1. Asset Mapping:** Maintain an explicit inventory of API endpoints, databases, buckets, and PII data flows.
- [MUST] **A2. Threat Modeling:** Map attack vectors by personas (anonymous user, regular user, admin, bot).
- [MUST] **A3. Environment Isolation:** Enforce total separation between `Dev`, `Staging`, and `Prod`. Production/real customer data is strictly forbidden in staging/dev.
- [MUST] **A4. Principle of Least Privilege (PoLP):** Grant minimal operational permissions to services, databases, and functions.
- [MUST] **A5. Separation of Duties (SoD):** Segregate permissions between coding, code review/approval, and deployment execution.

### B. Identity, Authentication, and Access Management
- [MUST] **B6. Standardized Authentication:** Rely exclusively on established protocols and providers (OAuth 2.0, OIDC, Supabase Auth, Firebase Auth, NextAuth).
- [MUST] **B7. Password Hashing:** Mandatory use of GPU/ASIC-resistant algorithms (Argon2id or Bcrypt with appropriate cost factor).
- [MUST] **B8. Multi-Factor Authentication (MFA):** Require TOTP/FIDO2 for administrators and sensitive actions.
- [MUST] **B9. Tokens and Sessions:** Strongly signed JWTs/Sessions (RS256/EdDSA), short lifespan, refresh token rotation, and active revocation mechanisms.
- [MUST] **B10. Session Cookie Protection:** Require `HttpOnly`, `Secure`, and `SameSite=Strict|Lax` flags.
- [MUST] **B11. Anti-Enumeration:** Generic error messages for authentication failures (e.g., "Invalid credentials").

### C. API Security and Granular Authorization
- [MUST] **C12. BOLA/IDOR Defense:** Every API route (`/api/resource/[id]`) must validate that `session.user.id == resource.owner_id`.
- [MUST] **C13. BFLA Defense:** Role-based/Attribute-based access control (RBAC/ABAC) validated in server middleware.
- [MUST] **C14. BOPA / Mass Assignment Defense:** Use strict DTOs and validation schemas (`Zod`, `Pydantic`) to strip protected internal fields (e.g., `is_admin`, `role`, `balance`).
- [MUST] **C15. Webhook Signature Protection:** Mandatory HMAC signature verification in headers + timestamp window checks (anti-replay attacks).
- [MUST] **C16. API Idempotency:** Enforce `Idempotency-Key` headers on mutable/financial transactions.

### D. Code, Inputs, and Browser Security
- [MUST] **D17. Strict Input Validation:** Server-side schema validation for 100% of incoming payloads.
- [MUST] **D18. SQL/NoSQL Injection Prevention:** Exclusive use of Prepared Statements or secure ORMs (Prisma, Drizzle, SQLAlchemy).
- [MUST] **D19. XSS Defense:** Context-aware output encoding and strict HTML sanitization using validated libraries (DOMPurify/sanitize-html).
- [MUST] **D20. Security Headers:** Configure `CSP`, `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`.
- [MUST] **D21. CSRF Protection:** Use Anti-CSRF Tokens and `SameSite` cookie attributes.
- [MUST] **D22. Secure File Handling:** Store uploads outside web root (private S3/Supabase Storage buckets), magic-byte validation, and randomized file renaming.
- [MUST] **D23. Error Handling:** Suppress stack traces and internal database error details in production environments.

### E. Infrastructure, Cloud, and Advanced Networking
- [MUST] **E24. Advanced SSRF Protection:** Strict blocking of server-initiated requests to loopback/internal IP ranges (`127.0.0.1`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) and cloud metadata services (`169.254.169.254`).
- [MUST] **E25. VPC and Private Networks:** Databases and caches must reside in private subnets without public IPs.
- [MUST] **E26. Domain & DNS Protection:** Enable 2FA on domain registrar, Registrar Lock, DNSSEC, and monitor for Subdomain Takeovers.
- [MUST] **E27. Encryption in Transit:** Mandatory HTTPS/TLS 1.2+.
- [MUST] **E28. Container Hardening:** Use `distroless` or `alpine` minimal base images, executed as non-root users (`USER node`).
- [MUST] **E29. Restricted CORS:** Explicitly define allowed origins; forbid wildcard `*` paired with `credentials: true`.

### F. Database and Secrets Management
- [MUST] **F30. Encryption at Rest:** AES-256 encryption for disks, sensitive tables, and backups.
- [MUST] **F31. Centralized Secrets Management:** Store keys/secrets in dedicated managers (Vault, AWS Secrets Manager, Supabase Vault).
- [MUST] **F32. Restricted DB Credentials:** Runtime application DB accounts must lack DDL permissions (`DROP`, `ALTER`).
- [MUST] **F33. Data Retention & Purging:** Automated scripts for data deletion or anonymization upon fulfillment of purpose.
- [MUST] **F34. Immutable Backups:** Automated periodic backups with immutable retention locks (Object Lock / WORM).

### G. Artificial Intelligence, LLM, and Autonomous Agents
- [MUST] **G35. Prompt Injection Defense:** Strictly segregate system instructions (`system_prompt`) from untrusted user inputs. Apply secondary guardrails and evaluators.
- [MUST] **G36. Multitenant Security in RAG:** Mandatory permission filtering at vector database metadata level (`vector database metadata filtering`).
- [MUST] **G37. Least Privilege in Agents (Tool Calling):** Execute agent tools in isolated sandboxes. Require Human-in-the-Loop confirmation for destructive, financial, or irreversible actions.
- [MUST] **G38. Denial of Wallet (DoW) Prevention:** Enforce token consumption quotas per user/tenant, short API timeouts, and hard cost caps.

### H. Availability and Observability
- [MUST] **H39. DDoS Mitigation:** Edge CDN/WAF layers (Cloudflare / AWS CloudFront).
- [MUST] **H40. Multi-Layer Rate Limiting:** Enforce limits by IP, User ID, Route, and Action.
- [MUST] **H41. Origin Shielding:** Origin servers accept connections exclusively from CDN/WAF IP ranges.
- [MUST] **H42. Protected Audit Logs:** Centralized, read-only logging without recording passwords, tokens, or PII.
- [MUST] **H43. Anomaly Alerts:** Real-time alerting on 4xx/5xx spikes or unusual CPU/Memory saturation.

### I. Secure Development and Supply Chain
- [MUST] **I44. AI Code Audit:** Mandatory human review of AI-generated authorization logic and suggested dependencies.
- [MUST] **I45. Software Composition Analysis (SCA):** Automated CVE scanning via Dependabot, Trivy, or Snyk.
- [MUST] **I46. CI/CD SAST/DAST Testing:** Automated secret scanning (Gitleaks) and static analysis (Semgrep) on every Pull Request.
- [MUST] **I47. Pipeline Hardening:** Protected branches, signed commits, and required approval workflows for production deploys.

### J. Privacy, LGPD Compliance, and Usability
- [MUST] **J48. PII Governance:** Formal mapping of legal bases, transparent privacy policy, consent management, and data subject rights channels.
- [MUST] **J49. Incident Response Plan (IRP):** Documented protocols for containment, investigation, and mitigation of data breaches.
- [MUST] **J50. Regulatory Breach Notification:** Official protocols for notifying data protection authorities (ANPD) and affected users within legal deadlines.
- [MUST] **J51. Secure Usability:** Interfaces designed without Dark Patterns or UI traps prone to accidental security user errors.

---

## 4. CRITICAL THREAT MITIGATION MATRIX

| Threat / Vulnerability | Signal / Attack Vector | Mandatory Code Rule (AI Directive) |
| :--- | :--- | :--- |
| **BOLA / IDOR** | `GET /api/user/102` by user `101` | Enforce explicit scope: `WHERE id = :id AND owner_id = :session_user_id` |
| **BOPA / Mass Assignment** | JSON payload with `"role": "admin"` | Validate with `Zod.strictObject({...})` stripping protected fields. |
| **SSRF** | User submits URL `http://169.254.169.254/` | Parse URL and call `isPrivateIP()` check before executing `fetch()`. |
| **Prompt Injection** | User prompt includes `"Ignore previous instructions"` | Wrap user input in distinct context blocks and apply guardrails. |
| **Secrets Leakage** | String `sk_live_...` present in code | Reject commit and move value to `process.env.SECRET_KEY`. |

---

## 5. EXECUTABLE INCIDENT RESPONSE AND PRIVACY WORKFLOW

In the event of a confirmed or suspected security incident, the AI and development team MUST follow this 6-step sequential workflow:

Step 01: [DETECTION & ALERT]
↳ Action: Isolate observability alerts, identify scope, and trigger Incident Response Team.

Step 02: [IMMEDIATE CONTAINMENT]
↳ Action: Disconnect affected systems, revoke compromised keys/tokens, and block malicious IPs.

Step 03: [ERRADICATION & REPAIR]
↳ Action: Eliminate root vulnerability, apply security patches, and validate in staging environment.

Step 04: [RECOVERY & RESTORATION]
↳ Action: Restore services from clean, immutable backups and verify operational integrity.

Step 05: [FORENSIC ANALYSIS]
↳ Action: Preserve digital evidence, analyze audit logs, and measure scope of impacted PII.

Step 06: [REGULATORY & USER NOTIFICATION]
↳ Action: Assess risks and issue official breach notifications to data protection authorities (ANPD) and users within legal timeframes.

---

## 6. RELEASE GATE (GO / NO-GO CHECKLIST)

Deployments to Production are STRICTLY BLOCKED (NO-GO) if any of the following items remain unaddressed:

- [ ] **NO-GO 1:** Critical or High severity vulnerabilities detected in SAST/SCA/DAST pipelines.
- [ ] **NO-GO 2:** Any hardcoded private keys, passwords, or tokens in source repository or client bundles.
- [ ] **NO-GO 3:** Any mutable route or query lacking explicit server-side authorization/ownership checks.
- [ ] **NO-GO 4:** Direct public internet exposure of database or Redis ports.
- [ ] **NO-GO 5:** Missing automated backup routines or lack of verified restore test in the past 90 days.
- [ ] **NO-GO 6:** Plain HTTP traffic present in production environment (lack of HTTPS/TLS).
- [ ] **NO-GO 7:** Absence of Terms of Service or Privacy Policy aligned with actual app data processing.

---

## 7. PROJECT CONTEXT (TECHNICAL STACK INJECTION)

Instruction for AI: Use the parameters below to adapt all framework rules to the specific target project.

Project Name: "Saber Brasil"
Environment: "Next.js 15+ (App Router) / Supabase (Auth, Postgres, RLS, Storage) / Tailwind CSS"
Security Features Active:
  - Supabase Row Level Security (RLS) enabled on 100% of tables.
  - Cloudflare Turnstile anti-bot active on form and evaluation submissions.
  - Authentication via Resend OTP (6-digit) and Google OAuth.
  - Input validation middleware and protected dynamic routes.