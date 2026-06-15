import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Dev/guest user UUID — used when no JwtAuthGuard is active.
 * Must match the user created by `prisma/seed.ts`.
 *
 * Configured via DEV_USER_ID env var so different environments can use
 * different seeds without changing code.
 */
export const GUEST_USER_ID =
  process.env.DEV_USER_ID ?? '00000000-0000-0000-0000-000000000001';

/**
 * @CurrentUser() — extracts userId from the current request.
 *
 * Behaviour:
 *   - WITH JwtAuthGuard:    reads request.user.userId (set by JwtStrategy.validate)
 *   - WITHOUT JwtAuthGuard: falls back to GUEST_USER_ID for dev/testing
 *
 * Migration path to real auth:
 *   1. Build AuthModule (see .ai/auth-guide.md)
 *   2. Add @UseGuards(JwtAuthGuard) to the controller class
 *   3. The decorator already reads request.user.userId — nothing else changes
 *   4. Remove the ?? GUEST_USER_ID fallback once auth is stable
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{ user?: { userId: string } }>();
    return request.user?.userId ?? GUEST_USER_ID;
  },
);
