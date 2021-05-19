import React, { FC } from 'react';
import { Icon, IconTag } from '@powerfulyang/components';
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

type NodeType = 'paragraph' | 'text' | 'html';

type NodePosition = {
  start: { line: number; column: number; offset: number };
  end: { line: number; column: number; offset: number };
};

type Node = {
  properties: any;
  type: NodeType;
  children: Node[];
  value: string;
  position: NodePosition;
  url: string;
};

export const Paragraph: FC<{ node: Node }> = (props) => {
  const text = props.node.children[0].value;
  if (text?.startsWith('tags=>')) {
    const tags = text.trim().replace('tags=>', '').split('|');
    return (
      <div className="my-4 lg:ml-6 sm:ml-2">
        {tags.map((tag) => (
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
    const viewCount = info[3];
    const avatar = props.node.children[1].properties.href;
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
        <span className={styles.view_count}>
          <Icon type="icon-view_count" />
          <span className={styles.post_info_comment}>被{viewCount}人临幸</span>
        </span>
        <span className="mt-2">
          <img src={avatar} alt="" className="w-4 h-4" />
        </span>
        <span className={styles.qrcode}>
          <a className={styles.post_info_comment}>手机上打开</a>
        </span>
      </div>
    );
  }
  return <p>{props.children}</p>;
};
