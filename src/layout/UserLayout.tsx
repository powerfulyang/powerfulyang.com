import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

type UserLayoutProps = {
  pathViewCount?: string;
};

export const UserLayout: FC<PropsWithChildren<UserLayoutProps>> = ({ children, pathViewCount }) => {
  return (
    <>
      <NavBar />
      {children}
      <Footer pathViewCount={pathViewCount} />
    </>
  );
};
