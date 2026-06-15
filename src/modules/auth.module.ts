/**
 * AuthModule — Feature module for authentication and authorization.
 *
 * CURRENT STATUS: Not yet implemented. Skeleton only.
 * See .ai/auth-guide.md for step-by-step implementation guide.
 *
 * ─── What this module will provide when implemented ───────────────────────
 *
 *  PassportModule          — Registers Passport.js with NestJS
 *  JwtModule               — Issues and verifies JWT tokens (via @nestjs/jwt)
 *  JwtStrategy             — Passport strategy that validates Bearer tokens
 *  RegisterUseCase         — Business logic for user registration
 *  LoginUseCase            — Business logic for login + token issuance
 *  UserPrismaRepository    — Prisma implementation of IUserRepository
 *  AuthController          — HTTP endpoints: POST /auth/register, POST /auth/login
 *
 * ─── Why JwtModule must use registerAsync (not register) ──────────────────
 *
 *  JWT_SECRET must be read from process.env at runtime via ConfigService.
 *  Using register({ secret: 'hardcoded' }) is a security vulnerability —
 *  secrets must never appear in source code.
 *
 * ─── Why this module exports JwtModule ───────────────────────────────────
 *
 *  JwtAuthGuard (used in all feature controllers) needs JwtService internally.
 *  Since JwtAuthGuard is declared in a shared location (presentation/guards/),
 *  the module that provides JwtService must export it so it can be resolved
 *  when NestJS compiles modules that use the guard.
 *  Alternative: make JwtAuthGuard a provider inside AuthModule and export it.
 *  Either approach works — choose one and be consistent.
 *
 * ─── Implementation checklist ─────────────────────────────────────────────
 *
 *  Step 1 — prisma/schema.prisma
 *    [ ] Add `passwordHash String @map("password_hash") @db.VarChar` to User model
 *    [ ] Run: pnpm prisma migrate dev --name add-password-hash-to-users
 *
 *  Step 2 — domain/user/entities/user.entity.ts
 *    [ ] Add passwordHash field to User entity constructor
 *
 *  Step 3 — infrastructure/persistence/repositories/user.prisma-repository.ts
 *    [ ] Create UserPrismaRepository implements IUserRepository
 *    [ ] Map Prisma User → User domain entity (include passwordHash)
 *
 *  Step 4 — application/auth/dtos/
 *    [ ] register.dto.ts   — { email: string; password: string; name?: string }
 *    [ ] login.dto.ts      — { email: string; password: string }
 *    [ ] auth-response.dto.ts — { accessToken: string; user: { id, email, name } }
 *
 *  Step 5 — application/auth/use-cases/
 *    [ ] register.use-case.ts — hash password, save user, issue token
 *    [ ] login.use-case.ts    — verify password with bcrypt.compare, issue token
 *
 *  Step 6 — infrastructure/auth/jwt.strategy.ts
 *    [ ] extends PassportStrategy(Strategy)
 *    [ ] validate(payload) returns { userId: payload.sub, email: payload.email }
 *    [ ] result is attached to request.user by Passport
 *
 *  Step 7 — presentation/guards/jwt-auth.guard.ts
 *    [ ] extends AuthGuard('jwt')
 *    [ ] no override needed — Passport handles validation automatically
 *
 *  Step 8 — presentation/decorators/current-user.decorator.ts
 *    [ ] createParamDecorator that reads ExecutionContext → request.user
 *    [ ] return type: AuthUser (define interface: { userId: string; email: string })
 *
 *  Step 9 — presentation/auth/auth.controller.ts
 *    [ ] POST /auth/register → RegisterUseCase
 *    [ ] POST /auth/login    → LoginUseCase
 *    [ ] No @UseGuards on these — they are public endpoints
 *
 *  Step 10 — this file (auth.module.ts)
 *    [ ] Uncomment and wire all providers below
 *    [ ] Import AuthModule in app.module.ts
 *
 *  Step 11 — controllers (source, assessment, concept)
 *    [ ] Remove STUB_USER_ID
 *    [ ] Uncomment @UseGuards(JwtAuthGuard)
 *    [ ] Uncomment @CurrentUser() userId: string parameter
 */

import { Module } from '@nestjs/common';

// TODO: Uncomment these imports after implementing each piece
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { INJECTION_TOKENS } from '@infrastructure/di/injection-tokens';
// import { UserPrismaRepository } from '@infrastructure/persistence/repositories/user.prisma-repository';
// import { JwtStrategy } from '@infrastructure/auth/jwt.strategy';
// import { RegisterUseCase } from '@application/auth/use-cases/register.use-case';
// import { LoginUseCase } from '@application/auth/use-cases/login.use-case';
// import { AuthController } from '@presentation/auth/auth.controller';

@Module({
  // TODO: Replace this empty module with the wired version once all pieces are built.
  // Suggested order: follow the checklist above top-to-bottom.
  //
  // imports: [
  //   PassportModule,
  //   JwtModule.registerAsync({
  //     imports: [ConfigModule],
  //     inject: [ConfigService],
  //     useFactory: (config: ConfigService) => ({
  //       secret: config.getOrThrow<string>('JWT_SECRET'),
  //       signOptions: { expiresIn: '15m' },
  //     }),
  //   }),
  // ],
  // controllers: [AuthController],
  // providers: [
  //   RegisterUseCase,
  //   LoginUseCase,
  //   JwtStrategy,
  //   { provide: INJECTION_TOKENS.USER_REPOSITORY, useClass: UserPrismaRepository },
  // ],
  // exports: [JwtModule],  // Needed so JwtService resolves inside JwtAuthGuard
})
export class AuthModule {}
