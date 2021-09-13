import { Icon } from '@powerfulyang/components';
import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type FooterProps = {
  pathViewCount?: number;
};
export const Footer: FC<FooterProps> = ({ pathViewCount }) => {
  return (
    <footer className={classNames(styles.footer)}>
      <div className="text-gray-400 text-sm hidden sm:block">
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
          © {new Date().getFullYear()} Power by
          <a
            href="https://github.com/powerfulyang/powerfulyang.com"
            target="_blank"
            rel="noreferrer"
            className="ml-2 text-pink-400"
          >
            powerfulyang
          </a>
        </span>
      </div>
      <div className="text-sm">
        <span className="hidden sm:inline text-pink-400">{pathViewCount}人临幸</span>
        <span className="ml-4 text-gray-400 text-lg">
          <a className="mr-2" href="https://twitter.com/hutyxxx" target="_blank" rel="noreferrer">
            <Icon className={styles.twitter} type="icon-twitter" />
          </a>
          <a
            className="mr-2"
            href="https://github.com/powerfulyang"
            target="_blank"
            rel="noreferrer"
          >
            <Icon className={styles.github} type="icon-github" />
          </a>
          <a href="https://instagram.com/powerfulyang" target="_blank" rel="noreferrer">
            <Icon className={styles.instagram} type="icon-instagram" />
          </a>
        </span>
      </div>
    </footer>
  );
};
