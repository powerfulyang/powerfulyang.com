import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import type { User } from '@/type/User';

type UserLayoutProps = {
  pathViewCount?: number;
  user?: User;
};

export const UserLayout: FC<PropsWithChildren<UserLayoutProps>> = ({
  children,
  pathViewCount,
  user,
}) => {
  return (
    <>
      <NavBar avatar={user?.avatar} nickname={user?.nickname} />
      {children}
      <Footer pathViewCount={pathViewCount} />
    </>
  );
};
