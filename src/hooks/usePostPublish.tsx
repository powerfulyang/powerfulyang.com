'use client';

import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export const UsePostPublish: FC<{ id?: string }> = ({ id = '0' }) => {
  const router = useRouter();

  useHotkeys(
    '., 。',
    () => {
      return router.push(`/app_post/publish/${id}`);
    },
    [router],
  );

  return null;
};
