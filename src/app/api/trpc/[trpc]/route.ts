import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server';

// export API handler
// @see https://trpc.io/docs/server/adapters
const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });
};

export { handler as GET, handler as POST };
