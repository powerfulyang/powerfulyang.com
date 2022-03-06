import type { FC } from 'react';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { atom, useAtom } from 'jotai';
import styles from './index.module.scss';

export const RedirectingAtom = atom(false);
export const IndicatorAtom = atom(true);

export const useShowIndicator = () => {
  const [showIndicator, setShowIndicator] = useAtom(IndicatorAtom);
  useEffect(() => {
    return () => {
      setShowIndicator(true);
    };
  }, [setShowIndicator]);
  return [showIndicator, setShowIndicator] as const;
};

export const Redirecting: FC = () => {
  const [isRedirecting] = useAtom(RedirectingAtom);
  const [showIndicator] = useShowIndicator();
  return (
    <>
      <div
        className={classNames(styles.redirecting, {
          invisible: !isRedirecting,
        })}
      />
      {!isRedirecting && showIndicator && <div className={styles.indicator} />}
    </>
  );
};
