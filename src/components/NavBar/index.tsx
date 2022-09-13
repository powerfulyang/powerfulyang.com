import type { FC } from 'react';
import React, { memo } from 'react';
import classNames from 'classnames';
import { ProjectName } from '@/constant/Constant';
import { useHistory } from '@/hooks/useHistory';
import { NavBarUser } from '@/components/NavBar/User';
import { DocSearch } from '@docsearch/react';
import { Dropdown, Menu } from '@powerfulyang/components';
import styles from './index.module.scss';
import { Link } from '../Link';

export const menus = ['post', 'timeline'];

type NavBarProps = {};

const Menus: FC = () => {
  const { pathname, pushState } = useHistory();

  return (
    <div className={styles.menus}>
      {menus.map((x) => (
        <Link
          key={x}
          className={classNames(
            {
              [styles.active]: pathname === `/${x}`,
            },
            styles.menu,
          )}
          href={`/${x}`}
        >
          {x}
        </Link>
      ))}
      <Dropdown
        className="mt-5"
        overlay={
          <Menu itemClassName="hover:bg-pink-200 text-sm">
            <div className="p-1">
              <Menu.Item
                menuKey="gallery"
                className="pointer"
                onClick={() => {
                  pushState('/gallery');
                }}
              >
                Gallery
              </Menu.Item>
              <Menu.Item
                className="pointer"
                menuKey="airdrop"
                onClick={() => {
                  pushState('/airdrop');
                }}
              >
                Airdrop
              </Menu.Item>
            </div>
          </Menu>
        }
      >
        <div className={classNames(styles.menu, 'pointer')}>More</div>
      </Dropdown>
    </div>
  );
};

Menus.displayName = 'Menus';

export const NavBar = memo<NavBarProps>(() => {
  return (
    <div className={styles.navPlaceholder}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <div className="mx-4 hidden w-[15ch] px-3 py-1 text-xl sm:block">
            <Link href="/" className={classNames(styles.title)}>
              {ProjectName}
            </Link>
          </div>
          <Menus />
          <DocSearch
            appId="A86PBLLW9T"
            apiKey="feb9259815bc0476dbbf018ef7fb25c6"
            indexName="powerfulyang"
          />
        </div>
        <NavBarUser />
      </nav>
    </div>
  );
});

NavBar.displayName = 'NavBar';
