import type { User } from '@/__generated__/api';
import { initTRPC, TRPCError } from '@trpc/server';
import SuperJSON from 'superjson';
import { jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';

interface Context {
  user?: User;
}

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const { router, middleware } = t;

const jwt_secret = process.env.JWT_SECRET;

const isAuthenticated = middleware(async ({ next, ctx }) => {
  const _headers = headers();
  const _cookies = cookies();
  const authorization = _headers.get('authorization') || _cookies.get('authorization')?.value || '';
  try {
    const user = await jwtVerify<User>(authorization, Buffer.from(jwt_secret));
    return await next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    });
  }
});

export const publicProcedure = t.procedure;
export const authenticatedProcedure = t.procedure.use(isAuthenticated);
