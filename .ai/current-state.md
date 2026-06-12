# Current State — book-summary-api

## Project Status
**Early scaffolding phase.** All architectural structure is in place. Zero business logic is implemented — every method body throws `new Error('Not implemented')`.

---

## Completed (Scaffolding)

- [x] Monorepo setup (pnpm workspaces + Turborepo)
- [x] NestJS app scaffolded with Clean Architecture layer structure
- [x] Prisma schema fully defined (`prisma/schema.prisma`) — all 12 tables, enums, relations
- [x] Domain entities defined for all domains (Book, Summary, Quiz, Concept, Assessment, Job, Progress, Mastery, Artifact, Source, User)
- [x] Repository interfaces defined for all domains
- [x] All use case classes scaffolded with constructor DI and TODO steps documented
- [x] All controllers scaffolded with correct routes and Swagger annotations
- [x] `INJECTION_TOKENS` registry complete for all repositories + services
- [x] `IAiProvider` interface defined (generateSummary, generateQuiz, extractConcepts, extractTextFromPdf)
- [x] `IFileStorage` interface defined (upload, download, delete, getSignedUrl)
- [x] All NestJS feature modules scaffolded with DI bindings
- [x] All Prisma repository stubs created (no query logic implemented)
- [x] Frontend scaffolded (see `book-summary-web/.ai/current-state.md`)

---

## Not Yet Implemented

### Authentication
- [ ] `AuthModule` — JWT strategy, guards, registration, login endpoints
- [ ] `JwtAuthGuard` — currently commented out on all controllers
- [ ] `@CurrentUser()` decorator — userId currently hardcoded as param placeholder
- [ ] All controllers pass `userId` as TODO placeholder

### Infrastructure
- [ ] `AiProviderService` — all 4 methods are stubs (no LLM API calls)
- [ ] `LocalFileStorageService` — all 4 methods are stubs
- [ ] Prisma repository implementations — all repos return `throw new Error('Not implemented')`

### Use Cases (all domains)
- [ ] `UploadBookUseCase.execute()`
- [ ] `GetBookUseCase.execute()`
- [ ] `ListBooksUseCase.execute()`
- [ ] `DeleteBookUseCase.execute()`
- [ ] `GenerateSummaryUseCase.execute()`
- [ ] `GetSummaryUseCase.execute()`
- [ ] `GenerateQuizUseCase.execute()`
- [ ] `SubmitQuizUseCase.execute()`
- [ ] `ExtractConceptsUseCase.execute()`
- [ ] `GetConceptsUseCase.execute()`
- [ ] `CreateAssessmentUseCase.execute()`
- [ ] `SubmitAssessmentUseCase.execute()`
- [ ] `TrackProgressUseCase.execute()`
- [ ] `GetProgressUseCase.execute()`

### Domain Entity Methods
- [ ] All `Book` entity methods (isReady, isProcessing, hasFailed, canGenerateSummary, canGenerateQuiz, belongsToUser)
- [ ] All `Job` entity methods (isPending, isRunning, isCompleted, hasFailed, isTerminal, canRetry)
- [ ] All `Assessment` entity methods (hasTitle, displayTitle)

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

1. Implement Prisma repositories (data layer first — everything depends on it)
2. Implement domain entity methods (business rules)
3. Implement `LocalFileStorageService`
4. Implement `AiProviderService` (choose OpenAI or Anthropic)
5. Implement use cases starting with Book domain (Upload → Get → List → Delete)
6. Implement Summary generation use case
7. Add `AuthModule` + JWT guards
8. Implement remaining use cases (Quiz, Concept, Assessment, Progress)
9. Connect frontend API modules to real endpoints
