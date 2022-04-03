import type { FC } from 'react';
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { getEnumKeys } from '@powerfulyang/utils';
import { motion } from 'framer-motion';
import type { User } from '@/type/User';
import { ProjectName } from '@/constant/Constant';
import { Menu } from '@/layout/UserLayout';
import styles from './index.module.scss';
import { Link } from '../Link';
import { useHistory } from '@/hooks/useHistory';

type NavBarProps = {
  user: User;
};

export const login = () => {
  const { href } = window.location;
  // 前往中央登录中心
  window.location.href = `https://admin.powerfulyang.com/user/login?redirect=${encodeURI(href)}`;
};

const Menus: FC = () => {
  const { pathname } = useHistory();
  const active = useMemo(() => {
    const name = pathname.split('/')[1];
    return Reflect.get(Menu, name);
  }, [pathname]);

  return useMemo(() => {
    return (
      <div className={styles.menus}>
        {getEnumKeys(Menu).map((x) => (
          <motion.div key={x} className="w-auto h-full relative flex items-center justify-center">
            <Link
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
    );
  }, [active]);
};

Menus.displayName = 'Menus';

export const NavBar: FC<NavBarProps> = ({ user }) => {
  return (
    <div className={styles.navPlaceholder}>
      <nav className={styles.nav}>
        <div className="w-[15ch] text-xl px-3 py-1 mx-4 hidden sm:block">
          <Link to="/" className={classNames(styles.title)}>
            {ProjectName}
          </Link>
        </div>
        <Menus />

        <div className={styles.user}>
          {(user && (
            <>
              <span className={styles.nickname}>{user.nickname}</span>
              <img src={user.avatar} className={styles.avatar} alt="avatar" />
            </>
          )) || (
            <motion.button type="button" className="pointer" onTap={login}>
              Login
            </motion.button>
          )}
        </div>
      </nav>
    </div>
  );
};
