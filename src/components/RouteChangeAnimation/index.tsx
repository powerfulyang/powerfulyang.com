import classNames from 'classnames';
import { useAtom } from 'jotai';
import type { FC } from 'react';
import React from 'react';
import { useRouteChangeAnimation } from '@/components/RouteChangeAnimation/useRouteChangeAnimation';
import { ChangingAtom } from '@/components/RouteChangeAnimation/changingAtom';
import styles from './index.module.scss';

export const RouteChangeAnimation: FC = () => {
  // when route change, show animation
  useRouteChangeAnimation();
  const [isChanging] = useAtom(ChangingAtom);
  return (
    <div
      className={classNames(styles.redirecting, {
        invisible: !isChanging,
      })}
    />
  );
};
