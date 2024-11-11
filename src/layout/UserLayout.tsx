import type { FC, PropsWithChildren } from 'react';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';

type UserLayoutProps = {
};

export const UserLayout: FC<PropsWithChildren<UserLayoutProps>> = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
};
