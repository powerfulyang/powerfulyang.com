import type { FC } from 'react';
import React from 'react';
import { Icon, IconTag } from '@powerfulyang/components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type {
  CodeComponent,
  LiComponent,
  UnorderedListComponent,
} from 'react-markdown/lib/ast-to-react';
import classNames from 'classnames';
import { useQuery } from 'react-query';
import { copyToClipBoard } from '@powerfulyang/utils';
import { MarkdownImageFromAssetManageAltConstant } from '@/constant/Constant';
import { LazyImage } from '@/components/LazyImage';
import { clientRequest } from '@/utils/request';
import { CosUtils } from '@/utils/lib';
import styles from './index.module.scss';

export const H1: FC = ({ children }) => (
  <h1 className="flex justify-center w-full pb-2 px-6">
    <span className={styles.heading1}>
      <span className={styles.prefix} />
      <span className={styles.content}>{children}</span>
      <span className={styles.suffix} />
    </span>
  </h1>
);

export const Link: FC<any> = ({ href, children }) => (
  <a rel="noreferrer" className={styles.link} target="_blank" href={href}>
    {children}
  </a>
);

export const BlockQuote: FC = ({ children }) => (
  <blockquote className={styles.blockquote}>{children}</blockquote>
);

export const Table: FC = ({ children }) => <table className={styles.table}>{children}</table>;

export const Paragraph: FC<any> = ({ node, children }) => {
  const text = node.children[0].value;
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
      <div className={styles.postInfo}>
        <span className={styles.author}>
          <Icon type="icon-author" />
          <span className={styles.postInfoComment}>{author}</span>
        </span>
        <span className={styles.date}>
          <Icon type="icon-date" />
          <span className={styles.postInfoComment}>发表于{postDate}</span>
        </span>
        <span className={styles.wordCount}>
          <Icon type="icon-count" />
          <span className={styles.postInfoComment}>文字总数{wordCount}</span>
        </span>
      </div>
    );
  }
  return <p>{children}</p>;
};

export const Code: CodeComponent = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  if (inline) {
    return (
      <code className={classNames(className, styles.inlineCode)} {...props}>
        {children}
      </code>
    );
  }
  const language = match?.[1] || 'unknown';
  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLanguage}>
          <span>{language}</span>
        </div>
        <div className={styles.toolbarAction}>
          <button type="button" onClick={() => copyToClipBoard(children.toString())}>
            Copy Code
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        showLineNumbers
        style={atomDark}
        language={language}
        PreTag="div"
        codeTagProps={{
          style: { fontFamily: `Fira Code, sans-serif` },
        }}
        customStyle={{
          borderRadius: 0,
          margin: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </>
  );
};

export const Pre: FC = ({ children }) => <pre>{children}</pre>;

export const Ul: UnorderedListComponent = ({ children, ...props }) => {
  const { className } = props;
  if (className) {
    return <ul className={styles.contains_task_list}>{children}</ul>;
  }
  return <ul>{children}</ul>;
};

export const Li: LiComponent = ({ children, ordered, index }) => (
  <li>
    {ordered && <span className={styles.orderedListIndex}>{index + 1}</span>}
    {children}
  </li>
);

const AssetImage: FC<{ src?: string }> = ({ src }) => {
  const { data } = useQuery([src], async () => {
    const res = await clientRequest(`/asset/${src}`);
    return {
      dataSrc: CosUtils.getCosObjectUrl(res.data.objectUrl),
      dataBlurSrc: CosUtils.getCosObjectBlurUrl(res.data.objectUrl),
    };
  });
  return <LazyImage src={data?.dataSrc} blurSrc={data?.dataBlurSrc} alt="" />;
};
export const Img = ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  if (alt === MarkdownImageFromAssetManageAltConstant) {
    return <AssetImage src={src} />;
  }
  return <img src={src} alt={alt} />;
};
