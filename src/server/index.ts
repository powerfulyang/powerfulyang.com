import { prettify } from '@/prettier/prettifyOnServer';
import { htmlToPug } from '@johnsoncodehk/html2pug';
import z from 'zod';
import { publicProcedure, router } from './trpc';

export const appRouter = router({
  html2pug: publicProcedure
    .input(
      z.object({
        html: z.string(),
      }),
    )
    .query((opts) => {
      const pug = htmlToPug(opts.input.html);
      return prettify('pug', pug);
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
