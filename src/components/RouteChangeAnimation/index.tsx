import { ChangingAtom } from '@/components/RouteChangeAnimation/changingAtom';
import { useRouteChangeAnimation } from '@/components/RouteChangeAnimation/useRouteChangeAnimation';
import classNames from 'classnames';
import { useAtomValue } from 'jotai';
import type { FC } from 'react';
import React from 'react';
import styles from './index.module.scss';

export const RouteChangeAnimation: FC = () => {
  // when route change, show animation
  useRouteChangeAnimation();
  const isChanging = useAtomValue(ChangingAtom);

  return (
    <div
      className={classNames(styles.redirecting, {
        invisible: !isChanging,
      })}
    />
  );
};
