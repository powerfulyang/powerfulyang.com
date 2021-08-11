import React, { FC } from 'react';
import { NavBar } from '@/components/NavBar';
import useSWR from 'swr';
import { swrRequest } from '@/utils/request';
import { useRouter } from 'next/router';
import { Footer } from '@/components/Footer';

export enum Menu {
  post,
  todo,
  timeline,
  gallery,
}

type UserLayoutProps = {
  pathViewCount?: number;
};
export const UserLayout: FC<UserLayoutProps> = ({ children, pathViewCount }) => {
  const { data: { data: user } = {} } = useSWR('/user/current', swrRequest());
  const { pathname } = useRouter();
  return (
    <>
      <NavBar active={Reflect.get(Menu, pathname.substr(1))} user={user} />
      {children}
      <Footer pathViewCount={pathViewCount} />
    </>
  );
};
