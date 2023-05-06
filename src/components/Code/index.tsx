import { copyToClipboardAndNotify } from '@/utils/copy';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { Prism } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './index.module.scss';

type Props = {
  language: string;
  children: string;
  maxHeight?: number;
  className?: string;
};

// 不要 class name 的下划线，俺不喜欢
delete atomDark['class-name'].textDecoration;

export const PrismCode: FC<Props> = ({ language, children, maxHeight, className }) => {
  return (
    <div className={classNames(styles.pre, className)}>
      <div data-mdast="ignore" className={styles.toolbar}>
        <div className={styles.toolbarLanguage}>{language}</div>
        <div className={styles.toolbarAction}>
          <button
            type="button"
            className="pointer"
            onClick={() => {
              return copyToClipboardAndNotify(children);
            }}
          >
            Copy Code
          </button>
        </div>
      </div>
      <Prism
        showLineNumbers
        style={atomDark}
        language={language}
        PreTag="pre"
        codeTagProps={{
          style: { fontFamily: `Fira Code, sans-serif` },
        }}
        customStyle={{
          borderRadius: 0,
          margin: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          maxHeight,
        }}
      >
        {children}
      </Prism>
    </div>
  );
};
