import { Icon } from '@powerfulyang/components';
import React, { memo } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type FooterProps = {
  pathViewCount?: number;
};

export const Footer = memo<FooterProps>(({ pathViewCount = 0 }) => (
  <footer className={classNames(styles.footer)}>
    <div className="hidden text-sm text-gray-400 sm:block">
      <span className="mr-1">备案号:</span>
      <a
        className="text-pink-400"
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noreferrer"
      >
        粤ICP备19128686号
      </a>
    </div>
    <div className="text-sm">
      <span>
        {`© ${new Date().getFullYear()} Power by `}
        <a
          href="https://github.com/powerfulyang/powerfulyang.com"
          target="_blank"
          rel="noreferrer"
          className="text-pink-400"
        >
          powerfulyang
        </a>
      </span>
    </div>
    <div className="flex items-baseline text-sm">
      <div className="hidden text-pink-400 sm:block">{pathViewCount}人临幸</div>
      <div className="contents space-x-1 text-lg text-gray-400">
        <a className="ml-4" href="https://twitter.com/hutyxxx" target="_blank" rel="noreferrer">
          <Icon className={styles.twitter} type="icon-twitter" />
        </a>
        <a href="https://github.com/powerfulyang" target="_blank" rel="noreferrer">
          <Icon className={styles.github} type="icon-github" />
        </a>
        <a href="https://instagram.com/powerfulyang" target="_blank" rel="noreferrer">
          <Icon className={styles.instagram} type="icon-instagram" />
        </a>
      </div>
    </div>
  </footer>
));

Footer.displayName = 'Footer';
