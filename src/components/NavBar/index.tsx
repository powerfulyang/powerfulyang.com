import type { FC } from 'react';
import React from 'react';
import classNames from 'classnames';
import { getEnumKeys } from '@powerfulyang/utils';
import { motion } from 'framer-motion';
import type { User } from '@/type/User';
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
    <div className={styles.navPlaceholder}>
      <nav className={styles.nav}>
        <div className="w-[15ch] text-xl px-3 py-1 mx-4 hidden-xs">
          <Link to="/" className={classNames(styles.title)}>
            {ProjectName}
          </Link>
        </div>
        <div className={styles.menus}>
          {getEnumKeys(Menu).map((x) => (
            <motion.div key={x} className="w-auto h-full relative flex items-center justify-center">
              <Link
                key={x}
                className={classNames({
                  [styles.active]: Reflect.get(Menu, x) === active,
                })}
                to={`/${x}`}
              >
                {x}
              </Link>
              {Reflect.get(Menu, x) === active && (
                <motion.div className={styles.activeTab} layoutId="nav-active-tab" />
              )}
            </motion.div>
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
        </div>
      </nav>
    </div>
  );
};
