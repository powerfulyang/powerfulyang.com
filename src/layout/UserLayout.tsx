import type { FC } from 'react';
import React from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import type { User } from '@/type/User';

export enum Menu {
  post,
  timeline,
  gallery,
}

type UserLayoutProps = {
  pathViewCount?: number;
  user: User;
};

export const UserLayout: FC<UserLayoutProps> = ({ children, pathViewCount, user }) => {
  return (
    <>
      <NavBar user={user} />
      {children}
      <Footer pathViewCount={pathViewCount} />
    </>
  );
};
