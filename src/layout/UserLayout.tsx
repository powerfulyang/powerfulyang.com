import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { User } from '@/types/User';

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
  const { pathname } = useRouter();
  return (
    <>
      <NavBar active={Reflect.get(Menu, pathname.substr(1))} user={user} />
      {children}
      <Footer pathViewCount={pathViewCount} />
    </>
  );
};
