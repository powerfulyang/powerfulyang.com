import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useHistory } from '@/hooks/useHistory';
import styles from './index.module.scss';

export const Link: FC<PropsWithChildren<{ to: string; className?: string }>> = ({
  children,
  className,
  to,
}) => {
  const { pushState } = useHistory();

  return (
    <motion.a
      className={classNames(styles.link, className)}
      href={to}
      onClick={(e) => {
        e.preventDefault();
        return pushState(to);
      }}
    >
      {children}
    </motion.a>
  );
};
