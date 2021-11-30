import type { FC } from 'react';
import React from 'react';
import classNames from 'classnames';
import { isNumeric } from '@powerfulyang/utils';
import type { User } from '@/type/User';
import { ProjectName } from '@/constant/Constant';
import { Menu } from '@/layout/UserLayout';
import styles from './index.module.scss';
import { Link } from '../Link';
import { Clock } from '@/components/Clock';

type NavBarProps = {
  user: User;
  active: Menu;
};

export const login = () => {
  const { href } = window.location;
  // 前往中央登录中心
  window.location.href = `https://admin.powerfulyang.com/user/login?redirect=${encodeURI(href)}`;
};

export const NavBar: FC<NavBarProps> = ({ user, active }) => (
  <div className={styles.navPlaceholder}>
    <nav className={styles.nav}>
      <span className={classNames(styles.title)}>{ProjectName}</span>
      <div className={styles.menus}>
        {Object.keys(Menu)
          .filter((x) => !isNumeric(x))
          .map((x) => (
            <Link
              key={x}
              className={classNames({
                [styles.active]: Reflect.get(Menu, x) === active,
              })}
              to={`/${x}`}
            >
              {x}
            </Link>
          ))}
      </div>

      <div className={styles.user}>
        <Clock className="mr-4" />
        {user && (
          <>
            <span className={styles.nickname}>{user.nickname}</span>
            <img src={user.avatar} className={styles.avatar} alt="avatar" />
          </>
        )}
        {!user && (
          <button type="button" className="cursor-pointer" onClick={login}>
            Login
          </button>
        )}
      </div>
    </nav>
  </div>
);
