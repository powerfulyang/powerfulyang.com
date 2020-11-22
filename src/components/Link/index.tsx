import { useRouter } from 'next/router';
import React, { FC } from 'react';
import './index.scss';

export const Link: FC<{ href: string }> = ({ children, href }) => {
  const router = useRouter();
  return (
    <a
      className="link"
      href={href}
      onClick={(e) => {
        e.preventDefault();
        router.push(href);
      }}
    >
      {children}
    </a>
  );
};
