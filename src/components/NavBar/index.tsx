import React, { FC } from 'react';
import { User } from '@/types/User';
import { ProjectName } from '@/constant/Constant';
import styles from './index.module.scss';
import { Link } from '../Link';

type NavBarProps = {
  user: User;
};

export const NavBar: FC<NavBarProps> = ({ user }) => {
  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <Link to="/" className={styles.title}>
          {ProjectName}
        </Link>
        <div className={styles.menus}>
          <Link to="/todos">todos</Link>
          <Link to="/timeline">timeline</Link>
          <Link to="/gallery">gallery</Link>
        </div>
      </div>

      <div className={styles.user}>
        <span className={styles.nickname}>{user?.nickname}</span>
        <img src={user?.avatar} alt="登录用户头像" />
      </div>
    </nav>
  );
};
