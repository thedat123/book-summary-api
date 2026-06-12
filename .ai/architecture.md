# Architecture — book-summary-api

## Style
Clean Architecture (Ports & Adapters) with Domain-Driven Design (DDD).
All dependency arrows point inward: Presentation → Application → Domain ← Infrastructure.

## Monorepo Context
Part of a pnpm + Turborepo monorepo.  
Sibling: `book-summary-web` (Next.js 15, port 3000).  
This API runs on port 3001 (`http://localhost:3001/api/v1`).

## Layer Map

```
src/
├── domain/          ← Pure business logic. No NestJS, no Prisma.
│   └── <domain>/
│       ├── entities/           Domain entity classes
│       ├── repositories/       Repository interfaces (IXxxRepository)
│       └── value-objects/      Typed value wrappers (status enums, VOs)
│
├── application/     ← Orchestration. Depends only on domain interfaces.
│   └── <domain>/
│       ├── use-cases/          One class per business operation
│       └── dtos/               Input/output shapes for the HTTP layer
│
├── infrastructure/  ← External integrations. Implements domain interfaces.
│   ├── ai/                     IAiProvider implementation (LLM calls)
│   ├── storage/                IFileStorage implementation (local / S3)
│   ├── persistence/
│   │   ├── prisma/             PrismaService (singleton, @Global)
│   │   └── repositories/      XxxPrismaRepository implements IXxxRepository
│   └── di/
│       └── injection-tokens.ts Central Symbol registry for DI tokens
│
├── presentation/    ← HTTP only. Zero business logic.
│   └── <domain>/
│       └── xxx.controller.ts   Parse request → call use case → return DTO
│
└── modules/         ← NestJS module wiring (DI bindings)
    └── xxx.module.ts
```

## Dependency Rules
1. `domain/` NEVER imports from `application/`, `infrastructure/`, or `presentation/`.
2. `application/` imports only from `domain/` interfaces, never from `infrastructure/` concretions.
3. `infrastructure/` imports from `domain/` interfaces to satisfy them; also imports `@prisma/client`.
4. `presentation/` imports only from `application/` (use cases + DTOs).
5. Use cases inject repositories via `@Inject(INJECTION_TOKENS.XYZ)` — never `new XxxPrismaRepository()`.

## Global Infrastructure Modules
`PrismaModule`, `StorageModule`, and `AiModule` are `@Global()`.  
Feature modules do NOT import them — NestJS resolves them automatically.

## Module Wiring Pattern
Each feature module (e.g., `BookModule`) follows this pattern:
```ts
{
  controllers: [XxxController],
  providers: [
    UseCase1, UseCase2,               // application layer
    { provide: INJECTION_TOKENS.XXX_REPOSITORY, useClass: XxxPrismaRepository }
  ],
}
```

## API Versioning
All routes are prefixed `/api/v1/` via `setGlobalPrefix('api/v1')` in `main.ts`.

## Auth
JWT guards exist as comments (`// @UseGuards(JwtAuthGuard)`) everywhere.  
`AuthModule` is listed as TODO in `app.module.ts`.  
`@CurrentUser()` decorator extracts `userId` from JWT payload.

## Naming Conventions
- Entity files: `<name>.entity.ts`
- Repository interfaces: `<name>.repository.interface.ts`
- Use case classes: `XxxYyyUseCase` in `xxx-yyy.use-case.ts`
- DTO classes: `XxxYyyDto` in `xxx-yyy.dto.ts`
- Controller files: `<name>.controller.ts`
- Module files: `<name>.module.ts`
- Value objects: `<name>.vo.ts`
