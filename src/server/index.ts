import { createServerSideHelpers } from '@trpc/react-query/server';
import { kv } from '@vercel/kv';
import z from 'zod';
import { publicProcedure, router } from './trpc';

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .query((opts) => {
      return `Hello ${opts.input.message}!`;
    }),
  cacheClean: publicProcedure.mutation(async () => {
    return kv.flushdb();
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

export const helpers = createServerSideHelpers({
  router: appRouter,
  ctx: {},
});
