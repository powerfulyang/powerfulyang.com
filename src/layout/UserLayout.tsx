import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

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
