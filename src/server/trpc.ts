import { Handlers } from '@sentry/nextjs';
import { initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context().create({
  transformer: SuperJSON,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const { router, middleware } = t;

const sentryMiddleware = middleware(
  // 1.
  Handlers.trpcMiddleware({
    attachRpcInput: true,
  }),
);

export const publicProcedure = t.procedure.use(sentryMiddleware);
