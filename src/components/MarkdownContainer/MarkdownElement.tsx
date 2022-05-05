import type { FC } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import { Icon } from '@powerfulyang/components';
import { PrismAsyncLight } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type {
  CodeComponent,
  HeadingComponent,
  LiComponent,
  UnorderedListComponent,
} from 'react-markdown/lib/ast-to-react';
import classNames from 'classnames';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import type { NormalComponents } from 'react-markdown/lib/complex-types';
import { MarkdownImageFromAssetManageAltConstant } from '@/constant/Constant';
import { requestAtClient } from '@/utils/client';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { copyToClipboardAndNotify } from '@/utils/copy';
import styles from './index.module.scss';

export const MDContainerContext = createContext({
  blur: true,
});

export const H1: HeadingComponent = ({ children }) => (
  <div className="relative">
    <div id={String(children).trim()} className={styles.anchor} />
    <h1 className="flex w-full justify-center pb-2">
      <span className={styles.heading1}>
        <span className={styles.prefix} />
        <span className={styles.content}>{children}</span>
        <span className={styles.suffix} />
      </span>
    </h1>
  </div>
);

export const H2: HeadingComponent = ({ children }) => {
  return (
    <div className="relative">
      <div id={String(children).trim()} className={styles.anchor} />
      <h2 className="cursor-text">{children}</h2>
    </div>
  );
};

export const H3: HeadingComponent = ({ children }) => {
  return (
    <div className="relative">
      <div id={String(children).trim()} className={styles.anchor} />
      <h3>
        <span>{children}</span>
      </h3>
    </div>
  );
};

export const H4: HeadingComponent = ({ children }) => {
  return (
    <div className="relative">
      <div id={String(children).trim()} className={styles.anchor} />
      <h4 className="max-w-full cursor-text truncate" title={String(children)}>
        {children}
      </h4>
    </div>
  );
};

export const A: NormalComponents['a'] = ({ href, children }) => (
  <a rel="noreferrer" className="link" target="_blank" href={href}>
    {children}
  </a>
);

export const BlockQuote: NormalComponents['blockquote'] = ({ children }) => (
  <blockquote className={styles.blockquote}>{children}</blockquote>
);

export const Table: NormalComponents['table'] = ({ children }) => (
  <div className="overflow-auto">
    <table className={styles.table}>{children}</table>
  </div>
);

export const Paragraph: NormalComponents['p'] = ({ node, children }) => {
  // @ts-ignore
  const text = node.children[0].value;
  if (text?.startsWith('tags=>')) {
    const tags = text.trim().replace('tags=>', '').split('|');
    return (
      <div className="flex flex-wrap sm:ml-2 lg:ml-6">
        {tags.map((tag: string) => (
          <motion.button
            type="button"
            key={tag}
            className="pointer my-2 mr-2"
            onTap={() => copyToClipboardAndNotify(tag)}
          >
            <Icon type="icon-tag" className="text-xl" />
            <span className="text-sm text-[#FFB356]">{tag}</span>
          </motion.button>
        ))}
      </div>
    );
  }
  if (text?.startsWith('post=>')) {
    const info = text.trim().replace('post=>', '').split('|');
    const author = info[0];
    const postDate = info[1];
    return (
      <div className={styles.postInfo}>
        <span className={styles.postInfoComment}>
          Published by {author} at {postDate}
        </span>
      </div>
    );
  }
  return <p>{children}</p>;
};

export const Code: CodeComponent = ({ inline, className, children }) => {
  const match = /language-(\w+)/.exec(className || '');
  const renderText = useMemo(() => children.toString().replace(/\s*\n$/, ''), [children]);
  if (inline) {
    return (
      <motion.code
        role="button"
        title="点击复制"
        onTap={() => {
          return copyToClipboardAndNotify(renderText);
        }}
        className={classNames(className, styles.inlineCode, 'pointer')}
      >
        {renderText}
      </motion.code>
    );
  }
  const language = match?.[1] || 'unknown';

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLanguage}>{language}</div>
        <div className={styles.toolbarAction}>
          <motion.button
            type="button"
            className="pointer"
            onTap={() => {
              return copyToClipboardAndNotify(renderText);
            }}
          >
            Copy Code
          </motion.button>
        </div>
      </div>
      <PrismAsyncLight
        showLineNumbers
        style={atomDark}
        language={language}
        PreTag="pre"
        codeTagProps={{
          style: { fontFamily: `Fira Code, sans-serif`, cursor: 'text', whiteSpace: 'pre' },
        }}
        customStyle={{
          borderRadius: 0,
          margin: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {renderText}
      </PrismAsyncLight>
    </>
  );
};

export const Pre: NormalComponents['pre'] = ({ children }) => <pre>{children}</pre>;

export const Ul: UnorderedListComponent = ({ children, ...props }) => {
  const { className } = props;
  if (className === 'contains-task-list') {
    return <ul className={styles.containsTaskList}>{children}</ul>;
  }
  return <ul>{children}</ul>;
};

export const Li: LiComponent = ({ children }) => <li>{children}</li>;

const AssetImage: FC<{ id: string }> = ({ id }) => {
  const { blur } = useContext(MDContainerContext);
  const { data } = useQuery({
    queryKey: ['md-asset-img', id],
    queryFn: async () => {
      const res = await requestAtClient(`/public/asset/${id}`);
      return res.data;
    },
  });
  return (
    (data && (
      <LazyAssetImage keepAspectRatio containerClassName="mt-2" lazy={blur} asset={data} />
    )) ||
    null
  );
};
export const Img: NormalComponents['img'] = ({ src, alt }) => {
  if (alt === MarkdownImageFromAssetManageAltConstant && src) {
    return <AssetImage id={src} />;
  }
  // 因为开发的时候 图片没有被缓存 会出现高度突然变化的问题 导致页面闪烁
  return (
    <span className="mt-2 block w-full">
      <img src={src} alt={alt} />
    </span>
  );
};
