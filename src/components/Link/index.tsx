import { useRouter } from 'next/router';
import React, { FC, useContext } from 'react';
import './index.scss';
import { LinkContext } from '@/context/LinkContext';
import { GlobalContextActionType } from '@/context/GlobalContextProvider';

export const Link: FC<{ to: string }> = ({ children, to }) => {
  const router = useRouter();
  const { dispatch } = useContext(LinkContext);
  return (
    <a
      className="link"
      href={to}
      onClick={async (e) => {
        dispatch({ type: GlobalContextActionType.LinkRedirectStart });
        e.preventDefault();
        await router.push(to);
      }}
    >
      {children}
    </a>
  );
};
