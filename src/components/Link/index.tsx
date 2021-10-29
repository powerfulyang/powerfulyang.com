import { useRouter } from 'next/router';
import type { FC} from 'react';
import React, { useContext } from 'react';
import classNames from 'classnames';
import { LinkContext } from '@/context/LinkContext';
import { GlobalContextActionType } from '@/context/GlobalContextProvider';
import styles from './index.module.scss';

export const Link: FC<{ to: string; className?: string }> = ({ children, className, to }) => {
  const router = useRouter();
  const { dispatch } = useContext(LinkContext);
  return (
    <a
      className={classNames(styles.link, className)}
      href={to}
      onClick={async (e) => {
        e.preventDefault();
        dispatch({ type: GlobalContextActionType.LinkRedirectStart });
        await router.push(to);
        dispatch({ type: GlobalContextActionType.LinkRedirectEnd });
      }}
    >
      {children}
    </a>
  );
};
