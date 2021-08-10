import React, { FC } from 'react';
import { User } from '@/types/User';
import { ProjectName } from '@/constant/Constant';
import { Menu } from '@/layout/UserLayout';
import classNames from 'classnames';
import { isNumeric } from '@powerfulyang/utils';
import styles from './index.module.scss';
import { Link } from '../Link';

type NavBarProps = {
  user: User;
  active: Menu;
};

export const NavBar: FC<NavBarProps> = ({ user, active }) => {
  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <Link to="/" className={styles.title}>
          {ProjectName}
        </Link>
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
      </div>

      <div className={styles.user}>
        <span className={styles.nickname}>{user?.nickname}</span>
        <img src={user?.avatar} alt="登录用户头像" />
      </div>
    </nav>
  );
};
