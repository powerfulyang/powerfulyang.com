import type { FC, PropsWithChildren } from 'react';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import '@/styles/app.scss';

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
