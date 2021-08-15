import React, { FC } from 'react';
import { Icon, IconTag } from '@powerfulyang/components';
import { CodeComponent } from 'react-markdown/lib/ast-to-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './index.module.scss';

export const H1: FC = ({ children }) => {
  return (
    <h1 className="flex justify-center h-auto mt-10">
      <span className={styles.heading1}>
        <span className={styles.prefix} />
        <span className={styles.content}>{children}</span>
        <span className={styles.suffix} />
      </span>
    </h1>
  );
};

export const Link: FC<any> = ({ href, children }) => {
  return (
    <a rel="noreferrer" target="_blank" href={href}>
      {children}
    </a>
  );
};

export const BlockQuote: FC = ({ children }) => {
  return <blockquote className={styles.blockquote}>{children}</blockquote>;
};

export const Table: FC = (props) => {
  return <table className={styles.table}>{props.children}</table>;
};

export const Paragraph = (props: any) => {
  const text = props.node.children[0].value;
  if (text?.startsWith('tags=>')) {
    const tags = text.trim().replace('tags=>', '').split('|');
    return (
      <div className="my-4 lg:ml-6 sm:ml-2">
        {tags.map((tag: string) => (
          <IconTag key={tag} value={tag} />
        ))}
      </div>
    );
  }
  if (text?.startsWith('post=>')) {
    const info = text.trim().replace('post=>', '').split('|');
    const author = info[0];
    const postDate = info[1];
    const wordCount = info[2];
    return (
      <div className={styles.post_info}>
        <span className={styles.author}>
          <Icon type="icon-author" />
          <span className={styles.post_info_comment}>{author}</span>
        </span>
        <span className={styles.date}>
          <Icon type="icon-date" />
          <span className={styles.post_info_comment}>发表于{postDate}</span>
        </span>
        <span className={styles.word_count}>
          <Icon type="icon-count" />
          <span className={styles.post_info_comment}>文字总数{wordCount}</span>
        </span>
        <span className={styles.qrcode}>
          <a className={styles.post_info_comment}>手机上打开</a>
        </span>
      </div>
    );
  }
  return <p>{props.children}</p>;
};

export const Code: CodeComponent = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter style={dark} language={match[1]} PreTag="div" {...(props as any)}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};
