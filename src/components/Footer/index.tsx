'use client';

import classNames from 'classnames';
import { memo } from 'react';
import { Icon } from '../Icon';
import styles from './index.module.scss';

type FooterProps = {
};

export const Footer = memo<FooterProps>(() => (
  <>
    <div className={styles.placeholder} />
    <footer className={classNames(styles.footer)}>
      <div className="hidden text-sm text-gray-400 sm:block">
        <span className="mr-1">友情链接:</span>
        <a
          className="text-pink-400"
          href="https://littleeleven.com"
          target="_blank"
          rel="noreferrer"
        >
          宝贝
        </a>
      </div>
      <div className="text-sm">
        <span>
          {`© ${new Date().getFullYear()} Power by `}
          <a
            href="https://github.com/powerfulyang"
            target="_blank"
            rel="noreferrer"
            className="text-pink-400"
          >
            powerfulyang
          </a>
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <a href="https://github.com/powerfulyang/powerfulyang.com" target="_blank" rel="noreferrer">
          <Icon className="mr-2 align-text-top text-lg" type="icon-github"/>
          <span>Source Code</span>
        </a>
      </div>
    </footer>
  </>
));

Footer.displayName = 'Footer';
