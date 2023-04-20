import { LazyImage } from '@/components/LazyImage';
import React, { useMemo } from 'react';
import { useUser } from '@/hooks/useUser';
import classNames from 'classnames';
import styles from './index.module.scss';

export const login = () => {
  const { href } = window.location;
  // 前往中央登录中心
  window.location.href = `https://admin.powerfulyang.com/user/login?redirect=${encodeURI(href)}`;
};

export const NavBarUser = () => {
  const { isFetching, user } = useUser(true);

  const Component = useMemo(() => {
    return user ? (
      <div className={classNames(styles.user, 'pointer')}>
        <span className={styles.nickname}>{user.nickname}</span>
        <LazyImage
          className="aspect-square"
          src={user.avatar}
          containerClassName={styles.avatar}
          alt="avatar"
        />
      </div>
    ) : (
      <button type="button" className="pointer mr-4 block text-pink-400" onClick={login}>
        Login
      </button>
    );
  }, [user]);
  return isFetching && !user ? <span className="pr-4 text-pink-400">Loading...</span> : Component;
};
