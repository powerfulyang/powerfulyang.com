import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/Skeleton';
import React from 'react';

export const LazyMarkdownContainer = dynamic(() => import('@/components/MarkdownContainer'), {
  loading: () => {
    return <Skeleton rows={4} />;
  },
});
