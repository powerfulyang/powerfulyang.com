import React, { FC } from 'react';
import { NavBar } from '@/components/NavBar';
import useSWR from 'swr';
import { swrRequest } from '@/utils/request';
import { useRouter } from 'next/router';

export enum Menu {
  post,
  todo,
  timeline,
  gallery,
}

export const UserLayout: FC = ({ children }) => {
  const { data: user } = useSWR('/user/current', swrRequest());
  const { pathname } = useRouter();
  return (
    <>
      <NavBar active={Reflect.get(Menu, pathname.substr(1))} user={user} />
      {children}
    </>
  );
};
