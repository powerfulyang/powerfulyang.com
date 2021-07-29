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
      <span>{user?.nickname}</span>
      <img src={user?.avatar} alt="登录用户头像" />
    </nav>
  );
};
