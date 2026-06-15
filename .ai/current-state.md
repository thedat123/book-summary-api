# Current State — book-summary-api

## Project Status
**Active implementation phase.** Core use cases for Source, Concept, and Assessment domains are implemented and tested. Controllers remain partially blocked on Auth (using STUB_USER_ID). Auth is intentionally deferred — see `.ai/auth-guide.md`.

---

## Completed

### Scaffolding
- [x] Monorepo setup (pnpm workspaces + Turborepo)
- [x] NestJS app scaffolded with Clean Architecture layer structure
- [x] Prisma schema fully defined (`prisma/schema.prisma`) — all 12 tables, enums, relations
- [x] Domain entities defined for all domains (Book, Summary, Quiz, Concept, Assessment, Job, Progress, Mastery, Artifact, Source, User)
- [x] Repository interfaces defined for all domains
- [x] `INJECTION_TOKENS` registry complete for all repositories + services
- [x] `IAiProvider` interface defined (generateSummary, generateQuiz, extractConcepts, extractTextFromPdf)
- [x] `IFileStorage` interface defined (upload, download, delete, getSignedUrl)
- [x] All NestJS feature modules scaffolded with DI bindings
- [x] All Prisma repository stubs created (no query logic implemented)
- [x] Frontend scaffolded (see `book-summary-web/.ai/current-state.md`)

### Domain Entities (implemented + tested)
- [x] `source.entity` — all methods implemented and tested
- [x] `concept.entity`, `concept-relation.entity` — implemented and tested
- [x] `artifact.entity` — implemented and tested
- [x] `assessment.entity`, `question.entity`, `question-option.entity` — implemented and tested
- [x] `assessment-attempt.entity`, `question-attempt.entity` — implemented and tested
- [x] `learner-concept-mastery.entity` — implemented and tested
- [x] `user.entity` — basic methods (`hasEmail`, `displayName`) — tested
- [x] `job.entity` — implemented

### Use Cases (implemented + tested)
- [x] Source domain: `CreateSourceUseCase`, `GetSourceUseCase`, `ListSourcesUseCase`, `DeleteSourceUseCase`
- [x] Concept domain: `ExtractConceptsUseCase`, `GetConceptsUseCase`
- [x] Assessment domain: `CreateAssessmentUseCase`, `SubmitAssessmentUseCase`

### Controllers (scaffolded, partially working)
- [x] `SourceController` — wired to use cases; uses `STUB_USER_ID` pending auth
- [x] `AssessmentController` — scaffolded; endpoints throw until auth is wired
- [x] `ConceptController` — scaffolded; endpoints throw until auth is wired

---

## Not Yet Implemented

### Authentication (intentionally deferred — see `.ai/auth-guide.md`)
- [ ] `passwordHash` field in `prisma/schema.prisma` User model + migration
- [ ] `UserPrismaRepository` — `src/infrastructure/persistence/repositories/user.prisma-repository.ts`
- [ ] `RegisterUseCase`, `LoginUseCase` — `src/application/auth/use-cases/`
- [ ] Auth DTOs — `src/application/auth/dtos/`
- [ ] `JwtStrategy` — `src/infrastructure/auth/jwt.strategy.ts`
- [ ] `JwtAuthGuard` — `src/presentation/guards/jwt-auth.guard.ts`
- [ ] `@CurrentUser()` decorator — `src/presentation/decorators/current-user.decorator.ts`
- [ ] `AuthController` — `src/presentation/auth/auth.controller.ts`
- [ ] Wire `AuthModule` (`src/modules/auth.module.ts`) + import in `app.module.ts`
- [ ] Remove `STUB_USER_ID` from all controllers; uncomment `@UseGuards(JwtAuthGuard)`

### Infrastructure
- [ ] `AiProviderService` — all 4 methods are stubs (no LLM API calls)
- [ ] `LocalFileStorageService` — all 4 methods are stubs
- [ ] Prisma repository implementations — all repos return `throw new Error('Not implemented')`

### Use Cases (not yet implemented)
- [ ] Progress domain: `GetProgressUseCase`, `TrackProgressUseCase`
- [ ] Summary domain: `GetSummaryUseCase`, `GenerateSummaryUseCase`

### Prisma Repositories (all stubs — no query logic)
- [ ] `UserPrismaRepository`
- [ ] `ConceptPrismaRepository`
- [ ] `AssessmentPrismaRepository` (partial — used by AssessmentModule but queries not confirmed)
- [ ] `LearnerConceptMasteryPrismaRepository`

### Application Layer
- [ ] `apiClient` interceptors — JWT attachment + 401/403 handling
- [ ] `AuthStore.setAuth()` and `AuthStore.clearAuth()`
- [ ] All feature API modules (books.api, summaries.api, quizzes.api, etc.)
- [ ] All React Query hooks (`useBooks`, `useBook`, `useUploadBook`, etc.)
- [ ] Session stores (`AssessmentSessionStore`, `QuizSessionStore`)

### Infrastructure / Config
- [ ] Background job runner (BullMQ or NestJS event bus)
- [ ] `.env` configuration — AI provider API key, storage config
- [ ] Prisma migrations applied to real DB

---

## Technical Debt / Known Issues

1. **Naming divergence**: Application layer uses `Book`/`Summary`; DB uses `Source`/`Artifact`. `INJECTION_TOKENS` comments acknowledge this migration is incomplete. All new code should align with the DB naming (`Source`, `Artifact`).

2. **No tests**: No unit tests, no integration tests, no e2e tests written.

3. **pnpm-workspace.yaml** lists `apps/*` but packages are at root level (not in `apps/`). This means the workspace may not pick up the packages correctly — TODO verify.

4. **`book-summary-api` and `book-summary-web` each have their own `.git`** — they are not submodules of the root repo. The root has no `.git`.

5. **Summary/Quiz currently synchronous**: `GenerateSummaryUseCase` comment notes large books should use async jobs. The current design returns the result directly — convert to job-based when implementing.

---

## Upcoming Work (Suggested Order)

1. **Prisma repositories** — implement actual queries in `source.prisma-repository.ts`, `concept.prisma-repository.ts`, `assessment.prisma-repository.ts`, `learner-concept-mastery.prisma-repository.ts`
2. **Wire controllers** — connect `SourceController` endpoints (list, findOne, remove currently throw)
3. **Progress domain** — `GetProgressUseCase` + `TrackProgressUseCase`
4. **AiProviderService** — implement LLM calls (`extractConcepts`, `generateSummary`, etc.)
5. **Auth** — follow `.ai/auth-guide.md` when userId is needed from a real token
6. **Summary domain** — `GenerateSummaryUseCase` (depends on AiProviderService)
