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
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
