import { useRouter } from 'next/router';
import React, { FC, useContext } from 'react';
import { LinkContext } from '@/context/LinkContext';
import { GlobalContextActionType } from '@/context/GlobalContextProvider';
import './index.module.scss';

export const Link: FC<{ to: string }> = ({ children, to }) => {
  const router = useRouter();
  const { dispatch } = useContext(LinkContext);
  return (
    <a
      className="link"
      onClick={async () => {
        dispatch({ type: GlobalContextActionType.LinkRedirectStart });
        await router.push(to);
        dispatch({ type: GlobalContextActionType.LinkRedirectEnd });
      }}
    >
      {children}
    </a>
  );
};
