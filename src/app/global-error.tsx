'use client';

import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';
import { useEffect } from 'react';

const GlobalError = ({ error }: { error: Error }) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* This is the default Next.js error component, but it doesn't allow omitting the statusCode property yet. */}
        <Error statusCode={undefined as any} />
      </body>
    </html>
  );
};
export default GlobalError;
