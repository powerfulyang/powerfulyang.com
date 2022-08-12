import type { FC } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import { PrismAsyncLight } from 'react-syntax-highlighter';
import atomDark from '@/prism/atom-dark.mjs';
import type {
  CodeComponent,
  HeadingComponent,
  LiComponent,
  UnorderedListComponent,
} from 'react-markdown/lib/ast-to-react';
import classNames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import type { NormalComponents } from 'react-markdown/lib/complex-types';
import { MarkdownImageFromAssetManageAltConstant } from '@/constant/Constant';
import { requestAtClient } from '@/utils/client';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { copyToClipboardAndNotify } from '@/utils/copy';
import styles from './index.module.scss';

export const MDContainerContext = createContext({
  blur: true,
});

export const H1: HeadingComponent = ({ children, id }) => (
  <div className="relative">
    <div id={id} className={styles.anchor} />
    <h1 className="flex w-full justify-center pb-2">
      <span className={styles.heading1}>
        <span className={styles.prefix} />
        <span className={styles.content}>{children}</span>
        <span className={styles.suffix} />
      </span>
    </h1>
  </div>
);

export const H2: HeadingComponent = ({ children, id }) => {
  return (
    <div className="relative">
      <div id={id} className={styles.anchor} />
      <h2 className="cursor-text">{children}</h2>
    </div>
  );
};

export const H3: HeadingComponent = ({ children, id }) => {
  return (
    <div className="relative">
      <div id={id} className={styles.anchor} />
      <h3>
        <span>{children}</span>
      </h3>
    </div>
  );
};

export const H4: HeadingComponent = ({ children, id }) => {
  return (
    <div className="relative">
      <div id={id} className={styles.anchor} />
      <h4 className="max-w-full cursor-text truncate">{children}</h4>
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
  <div className="my-4 overflow-auto">
    <table className={styles.table}>{children}</table>
  </div>
);

export const Code: CodeComponent = ({ inline, className, children }) => {
  const match = /language-(\w+)/.exec(className || '');
  const renderText = useMemo(() => children.toString().replace(/\s*\n$/, ''), [children]);
  if (inline) {
    return (
      <code className={classNames(className, styles.inlineCode, 'cursor-text')}>{renderText}</code>
    );
  }
  const language = match?.[1] || 'unknown';

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLanguage}>{language}</div>
        <div className={styles.toolbarAction}>
          <button
            type="button"
            className="pointer"
            onClick={() => {
              return copyToClipboardAndNotify(renderText);
            }}
          >
            Copy Code
          </button>
        </div>
      </div>
      <PrismAsyncLight
        showLineNumbers
        style={atomDark as any}
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
  const { data: asset } = useQuery({
    queryKey: ['md-asset-img', id],
    queryFn: async () => {
      const res = await requestAtClient(`/public/asset/${id}`);
      return res.data;
    },
  });
  return (
    (asset && (
      <LazyAssetImage
        thumbnail={false}
        keepAspectRatio
        containerClassName="mt-2"
        lazy={blur}
        asset={asset}
      />
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
