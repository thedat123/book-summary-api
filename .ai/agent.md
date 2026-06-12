# Agent Prompt — book-summary-api

You are working on `book-summary-api`, a NestJS backend using Clean Architecture and DDD.

## Before Writing Any Code

**Step 1 — Identify the domain.**
Which domain does this task touch? Options: `book/source`, `summary/artifact`, `quiz`, `concept`, `assessment`, `progress`, `job`, `mastery`, `user`.

**Step 2 — Identify the layer.**
- Adding DB logic → `infrastructure/persistence/repositories/`
- Adding business rules → `domain/<domain>/entities/`
- Adding orchestration → `application/<domain>/use-cases/`
- Adding HTTP endpoint → `presentation/<domain>/`
- Adding DI wiring → `modules/<domain>.module.ts`

**Step 3 — Identify the files to read.**
Read ONLY these files before coding:

| Task | Files to read |
|---|---|
| Implementing a use case | `domain/<d>/entities/<e>.entity.ts`, `domain/<d>/repositories/<r>.repository.interface.ts`, `application/<d>/use-cases/<uc>.use-case.ts`, `application/<d>/dtos/*.dto.ts` |
| Implementing a repository | `domain/<d>/repositories/<r>.repository.interface.ts`, `infrastructure/persistence/repositories/<r>.prisma-repository.ts`, `prisma/schema.prisma` |
| Adding a new endpoint | `modules/<d>.module.ts`, `presentation/<d>/<d>.controller.ts`, use case file |
| Implementing an entity method | `domain/<d>/entities/<e>.entity.ts`, `domain/<d>/value-objects/*.vo.ts` |

**Never scan the whole repo.** The structure is predictable — use the paths above.

---

## Key Architectural Rules (Always Apply)

1. Use cases inject via `@Inject(INJECTION_TOKENS.XYZ)` — token registry is at `infrastructure/di/injection-tokens.ts`.
2. Use cases return DTOs, never domain entities or Prisma types.
3. Repositories map Prisma records → domain entities internally. The mapping is private.
4. Ownership check: every use case accessing user data must call `entity.belongsToUser(userId)` — throw `ForbiddenException` on failure.
5. AI calls go in `infrastructure/ai/ai-provider.service.ts` only.
6. File operations go in `infrastructure/storage/local-file-storage.service.ts` only.
7. Use NestJS HTTP exceptions (`NotFoundException`, `ForbiddenException`, `BadRequestException`) — not raw `Error`.

---

## Domain-to-File Quick Reference

```
book/source
  entity:     src/domain/book/entities/book.entity.ts
  repo-iface: src/domain/book/repositories/book.repository.interface.ts
  repo-impl:  src/infrastructure/persistence/repositories/book.prisma-repository.ts
  use-cases:  src/application/book/use-cases/
  controller: src/presentation/book/book.controller.ts
  module:     src/modules/book.module.ts

summary/artifact
  entity:     src/domain/summary/entities/summary.entity.ts
  repo-iface: src/domain/summary/repositories/summary.repository.interface.ts
  repo-impl:  src/infrastructure/persistence/repositories/summary.prisma-repository.ts
  use-cases:  src/application/summary/use-cases/
  controller: src/presentation/summary/summary.controller.ts
  module:     src/modules/summary.module.ts

quiz
  entity:     src/domain/quiz/entities/quiz.entity.ts + question.entity.ts
  repo-iface: src/domain/quiz/repositories/quiz.repository.interface.ts
  repo-impl:  src/infrastructure/persistence/repositories/quiz.prisma-repository.ts
  use-cases:  src/application/quiz/use-cases/
  controller: src/presentation/quiz/quiz.controller.ts
  module:     src/modules/quiz.module.ts

concept
  entity:     src/domain/concept/entities/concept.entity.ts + concept-relation.entity.ts
  repo-iface: src/domain/concept/repositories/concept.repository.interface.ts
  repo-impl:  src/infrastructure/persistence/repositories/concept.prisma-repository.ts
  use-cases:  src/application/concept/use-cases/
  controller: src/presentation/concept/concept.controller.ts
  module:     src/modules/concept.module.ts

assessment
  entities:   src/domain/assessment/entities/ (5 entity files)
  repo-iface: src/domain/assessment/repositories/ (3 interface files)
  repo-impl:  src/infrastructure/persistence/repositories/assessment.prisma-repository.ts
  use-cases:  src/application/assessment/use-cases/
  controller: src/presentation/assessment/assessment.controller.ts
  module:     src/modules/assessment.module.ts

progress
  entity:     src/domain/progress/entities/progress.entity.ts
              src/domain/mastery/entities/learner-concept-mastery.entity.ts
  repo-impl:  src/infrastructure/persistence/repositories/progress.prisma-repository.ts
  use-cases:  src/application/progress/use-cases/
  controller: src/presentation/progress/progress.controller.ts
  module:     src/modules/progress.module.ts

job
  entity:     src/domain/job/entities/job.entity.ts
  repo-iface: src/domain/job/repositories/job.repository.interface.ts
  injection:  src/infrastructure/di/injection-tokens.ts → JOB_REPOSITORY

ai-provider
  interface:  src/infrastructure/ai/ai-provider.interface.ts
  impl:       src/infrastructure/ai/ai-provider.service.ts
  module:     src/modules/ai.module.ts

file-storage
  interface:  src/infrastructure/storage/file-storage.interface.ts
  impl:       src/infrastructure/storage/local-file-storage.service.ts
  module:     src/modules/storage.module.ts
```

---

## DB Schema Quick Reference

Prisma schema: `prisma/schema.prisma`

Key tables: `users`, `sources`, `concepts`, `concept_relations`, `artifacts`,
`assessments`, `questions`, `question_options`, `assessment_attempts`,
`question_attempts`, `learner_concept_mastery`, `jobs`

All IDs are UUID. All timestamps are `timestamptz`. Enums are PostgreSQL native enums.

---

## Current State Warning

**Almost everything throws `new Error('Not implemented')`.** When implementing:
- Read the TODO comments in the use case file — they list the exact steps.
- Check `current-state.md` for what is and isn't done.
- Do NOT assume any method on repositories or entities works — verify the implementation exists first.

---

## Common Mistakes to Avoid

- Importing `PrismaService` directly in a use case — use the repository interface instead.
- Adding business logic in a controller.
- Forgetting to add a new use case to its feature module's `providers` array.
- Returning raw Prisma objects from a repository — always map to domain entities.
- Including `isCorrect` / `correctOption` in quiz/assessment API responses before submission.
- Skipping the ownership check when fetching user-owned resources.
