import type { FC } from 'react';
import React, { useContext } from 'react';
import classNames from 'classnames';
import { LinkContext } from '@/context/LinkContext';
import styles from './index.module.scss';

export const Redirecting: FC = () => {
  const { state } = useContext(LinkContext);
  return (
    <div
      className={classNames(styles.redirecting, {
        invisible: !state.isRedirecting,
      })}
    />
  );
};
