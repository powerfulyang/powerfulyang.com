import type { FC } from 'react';
import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
import { useHistory } from '@/hooks/useHistory';

export const Link: FC<{ to: string; className?: string }> = ({ children, className, to }) => {
  const { pushState } = useHistory();

  return (
    <a
      className={classNames(styles.link, className)}
      href={to}
      onClick={(e) => {
        e.preventDefault();
        return pushState(to);
      }}
    >
      {children}
    </a>
  );
};
