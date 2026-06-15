# Auth Implementation Guide

**Status:** Pending — not yet needed for current feature development.  
**Resume when:** Controllers need real `userId` instead of `STUB_USER_ID`.  
**Module skeleton:** `src/modules/auth.module.ts` (read the checklist there first).

---

## Mental Model — How Auth Flows in This System

```
POST /auth/login
      ↓
  AuthController
      ↓
  LoginUseCase              → checks email + bcrypt.compare → issues JWT
      ↓
  AuthResponseDto { accessToken }

─────────────────────────────────────────────────

GET /sources  (protected)
      ↓
  Authorization: Bearer <token>   ← client sends this header
      ↓
  JwtAuthGuard                    ← validates token, attaches user to request
      ↓
  @CurrentUser() userId: string   ← decorator reads request.user.userId
      ↓
  SourceController → ListSourcesUseCase.execute(userId, ...)
```

Everything from the guard downward is already built. You only need to build the guard and the left side (register/login).

---

## Step 1 — Prisma Schema

**File:** `prisma/schema.prisma`

**What to add to the `User` model:**
```prisma
model User {
  id           String    @id @default(uuid()) @db.Uuid
  email        String    @unique @db.VarChar
  name         String?   @db.VarChar
  passwordHash String    @map("password_hash") @db.VarChar  // ← ADD THIS
  createdAt    DateTime? @default(now()) @map("created_at") @db.Timestamptz
  // ... relations stay the same
}
```

**Why `passwordHash` and not `password`?**  
The field name signals intent — it documents that raw passwords are never stored. If a future reader sees `password`, they might wonder if it's hashed. `passwordHash` is self-documenting.

**After editing schema, run:**
```bash
pnpm prisma migrate dev --name add-password-hash-to-users
pnpm prisma generate
```

---

## Step 2 — User Domain Entity

**File:** `src/domain/user/entities/user.entity.ts`

**What to add:**
```ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,   // ← ADD THIS
    public readonly name: string | null,
    public readonly createdAt: Date | null,
  ) {}

  // existing methods stay the same
}
```

**Design question to think about:**  
Should domain entities expose `passwordHash` at all? What if `User` is returned in an API response? You will need to ensure you never accidentally serialize `passwordHash` into a DTO. The response DTO (`auth-response.dto.ts`) must only include `{ id, email, name }` — never `passwordHash`.

---

## Step 3 — UserPrismaRepository

**File to create:** `src/infrastructure/persistence/repositories/user.prisma-repository.ts`

**Pattern to follow:** Copy the structure of `source.prisma-repository.ts`.

**Skeleton to implement:**
```ts
// @Injectable()
// export class UserPrismaRepository implements IUserRepository {
//   constructor(private readonly prisma: PrismaService) {}
//
//   async findById(id: string): Promise<User | null> {
//     // prisma.user.findUnique({ where: { id } })
//     // if null → return null
//     // else → return new User(row.id, row.email, row.passwordHash, row.name, row.createdAt)
//   }
//
//   async findByEmail(email: string): Promise<User | null> {
//     // prisma.user.findUnique({ where: { email } })
//     // same mapping as above
//   }
//
//   async save(user: User): Promise<User> {
//     // prisma.user.create({ data: { id: user.id, email: user.email, ... } })
//     // return mapped User
//   }
//
//   async existsByEmail(email: string): Promise<boolean> {
//     // prisma.user.count({ where: { email } }) > 0
//   }
//
//   // update() and delete() — implement if needed
// }
```

**Key mapping concern:** `passwordHash` must be included in every `new User(...)` call inside this file. If you forget it, TypeScript will catch it because the constructor is typed.

---

## Step 4 — Application DTOs

**Directory to create:** `src/application/auth/dtos/`

### `register.dto.ts`
```ts
// export class RegisterDto {
//   @IsEmail()
//   email: string;
//
//   @IsString()
//   @MinLength(8)           // enforce minimum password length
//   password: string;
//
//   @IsString()
//   @IsOptional()
//   name?: string;
// }
```

### `login.dto.ts`
```ts
// export class LoginDto {
//   @IsEmail()
//   email: string;
//
//   @IsString()
//   @IsNotEmpty()
//   password: string;
// }
```

### `auth-response.dto.ts`
```ts
// export class AuthResponseDto {
//   accessToken: string;
//   user: {
//     id: string;
//     email: string;
//     name: string | null;
//   };
// }
//
// NEVER include passwordHash here.
```

---

## Step 5 — Use Cases

**Directory to create:** `src/application/auth/use-cases/`

### `register.use-case.ts` — logic outline

```ts
// RegisterUseCase.execute(dto: RegisterDto): Promise<AuthResponseDto>
//
// 1. Check email uniqueness
//    const exists = await userRepository.existsByEmail(dto.email)
//    if (exists) throw new ConflictException('Email already in use')
//
// 2. Hash the password BEFORE saving
//    const saltRounds = 10
//    const passwordHash = await bcrypt.hash(dto.password, saltRounds)
//    Why 10? It's the bcrypt sweet spot: slow enough to resist brute force,
//    fast enough not to degrade UX (~100ms on modern hardware).
//
// 3. Create and persist the User
//    const user = new User(randomUUID(), dto.email, passwordHash, dto.name ?? null, null)
//    const saved = await userRepository.save(user)
//
// 4. Issue JWT
//    const payload = { sub: saved.id, email: saved.email }
//    const accessToken = jwtService.sign(payload)
//
// 5. Return DTO (no passwordHash)
//    return { accessToken, user: { id: saved.id, email: saved.email, name: saved.name } }
```

### `login.use-case.ts` — logic outline

```ts
// LoginUseCase.execute(dto: LoginDto): Promise<AuthResponseDto>
//
// 1. Look up user by email
//    const user = await userRepository.findByEmail(dto.email)
//
// 2. Validate — use the SAME error message for both cases below.
//    Why? To prevent user enumeration attacks — an attacker should not be
//    able to determine whether an email exists by observing different errors.
//
//    if (!user) throw new UnauthorizedException('Invalid credentials')
//
// 3. Compare password
//    const isMatch = await bcrypt.compare(dto.password, user.passwordHash)
//    if (!isMatch) throw new UnauthorizedException('Invalid credentials')
//
// 4. Issue JWT + return DTO (same as RegisterUseCase step 4-5)
```

**Packages needed:**
```bash
pnpm add bcrypt @nestjs/jwt @nestjs/passport passport passport-jwt
pnpm add -D @types/bcrypt @types/passport-jwt
```

---

## Step 6 — JwtStrategy

**File to create:** `src/infrastructure/auth/jwt.strategy.ts`

```ts
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(config: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,   // ALWAYS validate expiry
//       secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
//     });
//   }
//
//   // Called by Passport after signature + expiry are verified.
//   // Whatever you return here is attached to request.user.
//   async validate(payload: { sub: string; email: string }) {
//     return { userId: payload.sub, email: payload.email };
//   }
// }
```

**Why `getOrThrow` instead of `get`?**  
`get()` returns `undefined` if the env var is missing — your app would silently start with `undefined` as the JWT secret, which would still sign tokens but they'd be unsecured garbage. `getOrThrow()` crashes on startup if the key is absent, which is the correct behavior.

---

## Step 7 — JwtAuthGuard

**File to create:** `src/presentation/guards/jwt-auth.guard.ts`

```ts
// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}
//
// That's it. AuthGuard('jwt') wires Passport's 'jwt' strategy automatically.
// Passport calls JwtStrategy.validate() and attaches the result to request.user.
// If validation fails, Passport throws UnauthorizedException — you don't handle it.
```

**Where to use it:**
```ts
// Option A — per-controller (preferred for now):
// @UseGuards(JwtAuthGuard)
// @Controller('sources')
// export class SourceController { ... }

// Option B — globally (via APP_GUARD in AppModule):
// { provide: APP_GUARD, useClass: JwtAuthGuard }
// Then use @Public() decorator to mark auth endpoints as exceptions.
// This approach is cleaner at scale but requires more setup. Skip for now.
```

---

## Step 8 — @CurrentUser() Decorator

**File:** `src/presentation/decorators/current-user.decorator.ts` ✅ **Already exists with guest fallback.**

```ts
// Define the shape of what JwtStrategy.validate() returns:
// export interface AuthUser {
//   userId: string;
//   email: string;
// }
//
// export const CurrentUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): AuthUser => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.user as AuthUser;
//   },
// );
//
// Usage in controller:
//   async create(@Body() dto: CreateSourceDto, @CurrentUser() user: AuthUser) {
//     return this.createSource.execute(dto, user.userId);
//   }
```

---

## Step 9 — AuthController

**File to create:** `src/presentation/auth/auth.controller.ts`

```ts
// @ApiTags('Auth')
// @Controller('auth')
// export class AuthController {
//   constructor(
//     private readonly register: RegisterUseCase,
//     private readonly login: LoginUseCase,
//   ) {}
//
//   @Post('register')
//   @HttpCode(HttpStatus.CREATED)
//   async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
//     return this.register.execute(dto);
//   }
//
//   @Post('login')
//   @HttpCode(HttpStatus.OK)      // 200, not 201 — login is not resource creation
//   async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
//     return this.login.execute(dto);
//   }
//
//   // NO @UseGuards here — these are public endpoints
// }
```

---

## Step 10 — Wire AuthModule

**File:** `src/modules/auth.module.ts` — uncomment the providers listed there.

**File:** `src/app.module.ts` — add `AuthModule` to imports:
```ts
// import { AuthModule } from './modules/auth.module';
//
// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     PrismaModule,
//     StorageModule,
//     AiModule,
//     AuthModule,        // ← add here
//     SourceModule,
//     ConceptModule,
//     AssessmentModule,
//   ],
// })
```

---

## Step 11 — Activate Guards in Controllers ✅ Partially done

`@CurrentUser()` is already wired in all controllers with a guest fallback.  
All use case calls are already connected.

**Remaining action when AuthModule is ready:**
```ts
// In each controller (source, assessment, concept):
// 1. Add import:
//    import { UseGuards } from '@nestjs/common';
//    import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
//
// 2. Uncomment the one line already marked:
//    // TODO [auth]: @UseGuards(JwtAuthGuard)
//
// 3. Remove the guest fallback from current-user.decorator.ts:
//    return request.user?.userId ?? GUEST_USER_ID;
//    → becomes:
//    return request.user.userId;  // guard guarantees it's set
```

That's the entire migration. No other controller changes needed.

---

## Environment Variables Required

Add to `.env` (never commit this file):
```
JWT_SECRET=your-random-secret-here-minimum-32-chars
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Common Mistakes to Avoid

| Mistake | Why it's wrong | Correct approach |
|---------|---------------|-----------------|
| `throw new NotFoundException('User not found')` in LoginUseCase | Reveals whether email exists (user enumeration) | Always `UnauthorizedException('Invalid credentials')` |
| `jwtFromRequest: ExtractJwt.fromBodyField('token')` | Token in body = logged in server logs | Always use `fromAuthHeaderAsBearerToken()` |
| `ignoreExpiration: true` | Tokens never expire = permanent access even after logout | Always `false` |
| `JwtModule.register({ secret: 'hardcoded' })` | Secret in source code | Always `registerAsync` with `ConfigService` |
| Returning `User` entity directly from controller | Exposes `passwordHash` | Always map to DTO that excludes sensitive fields |

---

## Test Cases to Write (for each piece)

```ts
// RegisterUseCase:
// - should create user and return access token
// - should throw ConflictException when email already exists
// - should hash password before saving (savedUser.passwordHash !== dto.password)
// - should not include passwordHash in response DTO

// LoginUseCase:
// - should return access token when credentials are valid
// - should throw UnauthorizedException when email not found
// - should throw UnauthorizedException when password is wrong
// - should use same error message for both failure cases

// JwtStrategy:
// - validate() should return { userId, email } from payload.sub and payload.email

// JwtAuthGuard:
// - should allow request when token is valid
// - should throw UnauthorizedException when token is missing
// - should throw UnauthorizedException when token is expired
```
