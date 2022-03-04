import type { FC } from 'react';
import React from 'react';
import classNames from 'classnames';
import { atom, useAtom } from 'jotai';
import styles from './index.module.scss';

export const RedirectingAtom = atom(false);

export const Redirecting: FC = () => {
  const [isRedirecting] = useAtom(RedirectingAtom);
  return (
    <>
      <div
        className={classNames(styles.redirecting, {
          invisible: !isRedirecting,
        })}
      />
      {!isRedirecting && <div className={styles.indicator} />}
    </>
  );
};
