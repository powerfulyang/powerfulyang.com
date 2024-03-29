'use client';

import { motion } from 'framer-motion';
import type { FC } from 'react';

import { cn } from '@/lib/utils';
import styles from './index.module.scss';

type SkeletonProps = {
  rows?: number;
  className?: string;
};

export const Skeleton: FC<SkeletonProps> = ({ rows = 4, className }) => {
  return (
    <div className={cn(styles.skeleton, className)}>
      {Object.keys(Array.from({ length: rows })).map((_) => (
        <motion.div
          animate={{
            scaleX: [0.9, 1, 0.9],
            transition: {
              duration: 1.5,
              ease: 'easeInOut',
              repeatType: 'loop',
              repeat: Infinity,
            },
          }}
          key={_}
          className={styles.skeletonRow}
        />
      ))}
    </div>
  );
};

Skeleton.displayName = 'Skeleton';
