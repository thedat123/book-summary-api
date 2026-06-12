# Coding Rules — book-summary-api

## Architecture Constraints

1. **No cross-layer imports.** Use cases never import `XxxPrismaRepository` directly. Controllers never import repositories. Always go through the interface + DI token.

2. **No NestJS decorators in domain entities.** Domain entities are plain TypeScript classes. No `@Injectable()`, no `@Column()`, no Prisma types.

3. **No Prisma types in application or domain.** Use cases work with domain entities, not `Prisma.XxxGetPayload<{}>`. Map in the repository implementation.

4. **Business logic belongs in domain entities or use cases.** Controllers only parse/validate HTTP input and delegate to use cases.

5. **Prompt engineering belongs in `infrastructure/ai/`.** Never put LLM prompts in use cases or domain entities.

6. **Always add the use case to the feature module's `providers` array** and bind the repository via `{ provide: INJECTION_TOKENS.XXX, useClass: XxxPrismaRepository }`.

---

## Adding a New Use Case — Checklist

1. Create DTO(s) in `src/application/<domain>/dtos/`
2. Create use case in `src/application/<domain>/use-cases/`
3. Inject only repository interfaces and `IAiProvider` / `IFileStorage` via `INJECTION_TOKENS`
4. Add use case to `src/modules/<domain>.module.ts` providers
5. Add controller endpoint in `src/presentation/<domain>/<domain>.controller.ts`
6. Never skip the ownership check (`belongsToUser(userId)`) when accessing user-owned resources

---

## Adding a New Domain Entity — Checklist

1. Add model to `prisma/schema.prisma`
2. Run `pnpm db:migrate` + `pnpm db:generate`
3. Create entity class in `src/domain/<domain>/entities/<name>.entity.ts`
4. Create repository interface in `src/domain/<domain>/repositories/<name>.repository.interface.ts`
5. Add `Symbol` to `INJECTION_TOKENS` in `src/infrastructure/di/injection-tokens.ts`
6. Create Prisma repository in `src/infrastructure/persistence/repositories/<name>.prisma-repository.ts`
7. Bind in the appropriate feature module

---

## Repository Rules

- Every `IXxxRepository` interface lives in `src/domain/<domain>/repositories/`
- Implementations in `src/infrastructure/persistence/repositories/` follow naming `XxxPrismaRepository`
- Repositories map Prisma records to domain entities — the mapping function is private to the repo
- Use `prisma.$transaction()` for multi-table writes in a single use case

---

## DTO Rules

- Input DTOs: use `class-validator` decorators (`@IsString()`, `@IsUUID()`, etc.)
- Output DTOs: plain classes or interfaces — no validation decorators needed
- DTOs are immutable data bags — no methods
- Response DTOs should never expose `isCorrect` on quiz/assessment questions before submission

---

## Dependency Injection Rules

- All tokens are `Symbol` (not strings) — prevents accidental token collision
- Tokens are defined ONLY in `src/infrastructure/di/injection-tokens.ts`
- Use `@Inject(INJECTION_TOKENS.TOKEN_NAME)` in constructor parameters
- Global modules (Prisma, AI, Storage) are already available — do NOT re-import them in feature modules

---

## Naming Conventions

| Concept | Convention | Example |
|---|---|---|
| Entity class | PascalCase | `AssessmentAttempt` |
| Entity file | kebab-case | `assessment-attempt.entity.ts` |
| Repository interface | `IXxxRepository` | `IAssessmentAttemptRepository` |
| Repository file | `xxx.repository.interface.ts` | `assessment-attempt.repository.interface.ts` |
| Use case class | `VerbNounUseCase` | `SubmitAssessmentUseCase` |
| Use case file | `verb-noun.use-case.ts` | `submit-assessment.use-case.ts` |
| Controller file | `<domain>.controller.ts` | `assessment.controller.ts` |
| Module file | `<domain>.module.ts` | `assessment.module.ts` |
| Value object file | `<name>.vo.ts` | `assessment-status.vo.ts` |

---

## Error Handling Conventions

- Throw NestJS built-ins from use cases: `NotFoundException`, `ForbiddenException`, `BadRequestException`
- `NotFoundException` when entity not found
- `ForbiddenException` when ownership check fails
- `BadRequestException` for invalid state transitions (e.g., generating quiz before summary)
- Do NOT throw raw `Error` objects — use NestJS HTTP exceptions

---

## Migrations

- Never edit DB manually — always through Prisma migrations
- `pnpm db:migrate` — generate and apply migration (dev)
- `pnpm db:generate` — regenerate Prisma client after schema change
- Column names in schema use `snake_case` with `@map("column_name")` and `@@map("table_name")`

---

## Auth

- Every route that accesses user data MUST use `@UseGuards(JwtAuthGuard)` (currently TODO)
- `userId` must come from `@CurrentUser()` decorator — NEVER from the request body
- Ownership check pattern: `if (!entity.belongsToUser(userId)) throw new ForbiddenException()`
