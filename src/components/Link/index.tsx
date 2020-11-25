import { useRouter } from 'next/router';
import React, { FC } from 'react';
import './index.scss';

export const Link: FC<{ to: string }> = ({ children, to }) => {
  const router = useRouter();
  return (
    <a
      className="link"
      href={to}
      onClick={(e) => {
        e.preventDefault();
        router.push(to);
      }}
    >
      {children}
    </a>
  );
};
