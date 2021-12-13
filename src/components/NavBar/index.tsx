import type { FC } from 'react';
import React from 'react';
import classNames from 'classnames';
import { getEnumKeys } from '@powerfulyang/utils';
import { useRouter } from 'next/router';
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

export const NavBar: FC<NavBarProps> = ({ user, active }) => {
  const router = useRouter();
  return (
    <div className={styles.navPlaceholder}>
      <nav className={styles.nav}>
        <button type="button" onClick={() => router.push('/')} className={classNames(styles.title)}>
          {ProjectName}
        </button>
        <div className={styles.menus}>
          {getEnumKeys(Menu).map((x) => (
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
          {(user && (
            <>
              <span className={styles.nickname}>{user.nickname}</span>
              <img src={user.avatar} className={styles.avatar} alt="avatar" />
            </>
          )) || (
            <button type="button" className="pointer" onClick={login}>
              Login
            </button>
          )}

          <div className="hidden-xs ml-4">
            <Clock />
          </div>
        </div>
      </nav>
    </div>
  );
};
