import type { FC } from 'react';
import React, { memo, useMemo } from 'react';
import classNames from 'classnames';
import { getEnumKeys } from '@powerfulyang/utils';
import { motion } from 'framer-motion';
import type { User } from '@/type/User';
import { ProjectName } from '@/constant/Constant';
import { useHistory } from '@/hooks/useHistory';
import { LazyImage } from '@/components/LazyImage';
import styles from './index.module.scss';
import { Link } from '../Link';

export enum Menu {
  post,
  timeline,
  gallery,
  airdrop,
}

type NavBarProps = {
  nickname?: User['nickname'];
  avatar?: User['avatar'];
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
          <motion.div key={x} className="relative flex h-full w-auto items-center justify-center">
            <Link
              className={classNames(
                {
                  [styles.active]: Reflect.get(Menu, x) === active,
                },
                styles.menu,
              )}
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

export const NavBar = memo<NavBarProps>(({ avatar, nickname }) => {
  return (
    <div className={styles.navPlaceholder}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <div className="mx-4 hidden w-[15ch] px-3 py-1 text-xl sm:block">
            <Link to="/" className={classNames(styles.title)}>
              {ProjectName}
            </Link>
          </div>
          <Menus />
        </div>

        <div className={styles.user}>
          {(nickname && (
            <>
              <span className={styles.nickname}>{nickname}</span>
              <LazyImage src={avatar} containerClassName={styles.avatar} alt="avatar" />
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
});

NavBar.displayName = 'NavBar';
