import type { FC } from 'react';
import React, { memo, useMemo } from 'react';
import classNames from 'classnames';
import { getEnumKeys } from '@powerfulyang/utils';
import { motion } from 'framer-motion';
import { ProjectName } from '@/constant/Constant';
import { useHistory } from '@/hooks/useHistory';
import { NavBarUser } from '@/components/NavBar/User';
import { DocSearch } from '@docsearch/react';
import styles from './index.module.scss';
import { Link } from '../Link';

export enum Menu {
  post,
  timeline,
  gallery,
}

type NavBarProps = {};

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
          <motion.div key={x}>
            <Link
              className={classNames(
                {
                  [styles.active]: Reflect.get(Menu, x) === active,
                },
                styles.menu,
              )}
              href={`/${x}`}
            >
              {x}
            </Link>
          </motion.div>
        ))}
      </div>
    );
  }, [active]);
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
