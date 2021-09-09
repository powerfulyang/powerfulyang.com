import React, { FC } from 'react';
import classNames from 'classnames';
import { isNumeric } from '@powerfulyang/utils';
import { User } from '@/types/User';
import { ProjectName } from '@/constant/Constant';
import { Menu } from '@/layout/UserLayout';
import styles from './index.module.scss';
import { Link } from '../Link';

type NavBarProps = {
  user: User;
  active: Menu;
};

export const login = () => {
  const { href } = window.location;
  // 前往中央登录中心
  window.location.href = `https://admin.powerfulyang.com/user/login?redirect=${encodeURI(href)}`;
};

export const NavBar: FC<NavBarProps> = ({ user, active }) => {
  return (
    <div className={styles.nav_placeholder}>
      <nav className={styles.nav}>
        <span className={classNames(styles.title)}>{ProjectName}</span>
        <div className={styles.menus}>
          {Object.keys(Menu)
            .filter((x) => !isNumeric(x))
            .map((x) => {
              return (
                <Link
                  key={x}
                  className={classNames({
                    [styles.active]: Reflect.get(Menu, x) === active,
                  })}
                  to={`/${x}`}
                >
                  {x}
                </Link>
              );
            })}
        </div>

        <div className={styles.user}>
          {user && (
            <>
              <span className={styles.nickname}>{user.nickname}</span>
              <img src={user.avatar} alt="avatar" />
            </>
          )}
          {!user && (
            <span className="pointer" onClick={login}>
              Login
            </span>
          )}
        </div>
      </nav>
    </div>
  );
};
