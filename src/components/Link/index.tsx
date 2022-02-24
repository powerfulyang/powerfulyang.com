import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import styles from './index.module.scss';
import { linkAtom } from '@/components/Redirecting';

export const Link: FC<{ to: string; className?: string }> = ({ children, className, to }) => {
  const router = useRouter();
  const [, setIsRedirecting] = useAtom(linkAtom);

  return (
    <a
      className={classNames(styles.link, className)}
      href={to}
      onClick={async (e) => {
        e.preventDefault();
        setIsRedirecting(true);
        await router.push(to);
        setIsRedirecting(false);
      }}
    >
      {children}
    </a>
  );
};
