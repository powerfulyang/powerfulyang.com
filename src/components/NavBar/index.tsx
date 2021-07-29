import React, { FC } from 'react';
import { User } from '@/types/User';
import styles from './index.module.scss';

type NavBarProps = {
  user: User;
};

export const NavBar: FC<NavBarProps> = ({ user }) => {
  return (
    <nav className={styles.nav}>
      {/* menu */}
      {user?.nickname}
      {user?.avatar}
    </nav>
  );
};
