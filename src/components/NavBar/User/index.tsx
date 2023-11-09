import { LazyImage } from '@/components/LazyImage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { loginUrl } from '@/constant/Constant';
import { useUser } from '@/hooks/useUser';
import { clientApi } from '@/request/requestTool';
import classNames from 'classnames';
import { LogOut, User } from 'lucide-react';
import React, { useMemo } from 'react';
import styles from './index.module.scss';

export const login = () => {
  const { href } = window.location;
  // 前往中央登录中心
  window.location.href = `${loginUrl}?redirect=${encodeURI(href)}`;
};

export const NavBarUser = () => {
  const { isFetching, user, refetch } = useUser(true);

  const Component = useMemo(() => {
    return user ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className={classNames(styles.user, 'pointer')}>
            <span className={styles.nickname}>{user.nickname}</span>
            <LazyImage
              crossOrigin="anonymous"
              className="aspect-square"
              src={user.avatar}
              containerClassName={styles.avatar}
              alt="avatar"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await clientApi.logout();
                return refetch();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
              <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <button type="button" className="pointer mr-4 block text-pink-400" onClick={login}>
        Login
      </button>
    );
  }, [refetch, user]);
  return isFetching && !user ? <span className="pr-4 text-pink-400">Loading...</span> : Component;
};
