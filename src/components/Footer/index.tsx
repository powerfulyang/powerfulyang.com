import { Icon } from '@powerfulyang/components';
import React, { memo } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type FooterProps = {
  pathViewCount?: number;
};

export const Footer = memo<FooterProps>(({ pathViewCount = 0 }) => (
  <>
    <div className={styles.placeholder} />
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
      <div className="flex items-center text-sm">
        <div className="hidden text-pink-400 sm:block">{pathViewCount}人临幸</div>
        <a href="https://github.com/powerfulyang" target="_blank" rel="noreferrer">
          <Icon className="ml-2 align-text-top text-lg text-gray-500" type="icon-github" />
        </a>
      </div>
    </footer>
  </>
));

Footer.displayName = 'Footer';
