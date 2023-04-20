import type { FC } from 'react';
import React, { memo, useMemo } from 'react';
import classNames from 'classnames';
import { ProjectName } from '@/constant/Constant';
import { useHistory } from '@/hooks/useHistory';
import { NavBarUser } from '@/components/NavBar/User';
import { DocSearch } from '@docsearch/react';
import styles from './index.module.scss';
import { Link } from '../Link';

export const menus = ['post', 'timeline', 'gallery', 'airdrop'];

type NavBarProps = {};

const Menus: FC = () => {
  const { pathname } = useHistory();

  const currentMenu = useMemo(() => {
    return menus.find((m) => pathname.includes(m)) || 'post';
  }, [pathname]);

  return (
    <div className={styles.menus}>
      {menus.map((x, index) => (
        <Link
          key={x}
          className={classNames(
            {
              [styles.active]: currentMenu === x,
              'hidden sm:inline-block': index >= 2,
            },
            styles.menu,
          )}
          href={`/${x}`}
        >
          {x}
        </Link>
      ))}
    </div>
  );
};

Menus.displayName = 'Menus';

export const NavBar = memo<NavBarProps>(() => {
  return (
    <div className={styles.navPlaceholder}>
      <nav id="nav" className={styles.nav}>
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
