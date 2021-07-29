import React, { FC } from 'react';
import { NavBar } from '@/components/NavBar';
import useSWR from 'swr';
import { swrRequest } from '@/utils/request';

export const UserLayout: FC = ({ children }) => {
  const { data: user } = useSWR('/user/current', swrRequest());
  return (
    <>
      <NavBar user={user} />
      {children}
    </>
  );
};
