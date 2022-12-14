import { LazyImage } from '@/components/LazyImage';
import React, { useMemo } from 'react';
import { useUser } from '@/hooks/useUser';
import { useMutation } from '@tanstack/react-query';
import { requestAtClient } from '@/utils/client';
import { Dropdown, Menu, notification } from '@powerfulyang/components';
import styles from './index.module.scss';

export const login = () => {
  const { href } = window.location;
  // 前往中央登录中心
  window.location.href = `https://admin.powerfulyang.com/user/login?redirect=${encodeURI(href)}`;
};

export const NavBarUser = () => {
  const { isFetching, user, refetch } = useUser(true);

  const logout = useMutation(
    () => {
      return requestAtClient('/user/logout', {
        method: 'POST',
      });
    },
    {
      onSuccess: () => {
        notification.success({
          message: '退出成功',
        });
        return refetch();
      },
    },
  );

  const Component = useMemo(() => {
    return user ? (
      <Dropdown
        overlay={
          <div className="divide-y divide-gray-100" role="document">
            <div className="p-1">
              <Menu.Item
                className="pointer block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-pink-200"
                menuKey="profile"
                onClick={() => {
                  notification.error({
                    message: '暂未实现',
                  });
                }}
              >
                Profile
              </Menu.Item>
            </div>
            <div className="p-1">
              <button
                className="pointer block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 hover:bg-pink-200"
                role="menuitem"
                tabIndex={0}
                type="button"
                onClick={() => logout.mutate()}
              >
                Logout
              </button>
            </div>
          </div>
        }
        className="mr-4"
      >
        <div className={styles.user}>
          <span className={styles.nickname}>{user.nickname}</span>
          <LazyImage
            className="aspect-square"
            src={user.avatar}
            containerClassName={styles.avatar}
            alt="avatar"
          />
        </div>
      </Dropdown>
    ) : (
      <button type="button" className="pointer mr-4 block text-pink-400" onClick={login}>
        Login
      </button>
    );
  }, [logout, user]);
  return isFetching && !user ? <span className="pr-4 text-pink-400">Loading...</span> : Component;
};
