import type { FC } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import { PrismAsync } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
import { toString } from 'hast-util-to-string';
import { TimelineItemContext } from '@/components/Timeline/TimelineItem/TimelineItemContext';
import styles from './index.module.scss';

// 不要 class name 的下划线，俺不喜欢
delete atomDark['class-name'].textDecoration;

export const MDContainerContext = createContext({
  blur: true,
});

export const H1: HeadingComponent = ({ children, id }) => {
  const { id_prefix } = useContext(TimelineItemContext);
  const v = id && `${id_prefix}${id}`;
  return (
    <div className="relative">
      <div title="anchor" id={v} className={styles.anchor} />
      <h1 className="flex w-full justify-center pb-2">
        <span className={styles.heading1}>
          <span className={styles.prefix} />
          <span className={styles.content}>{children}</span>
          <span className={styles.suffix} />
        </span>
      </h1>
    </div>
  );
};

export const H2: HeadingComponent = ({ children, id }) => {
  const { id_prefix } = useContext(TimelineItemContext);
  const v = id && `${id_prefix}${id}`;
  return (
    <div className="relative">
      <div title="anchor" id={v} className={styles.anchor} />
      <h2 className="cursor-text">{children}</h2>
    </div>
  );
};

export const H3: HeadingComponent = ({ children, id }) => {
  const { id_prefix } = useContext(TimelineItemContext);
  const v = id && `${id_prefix}${id}`;
  return (
    <div className="relative">
      <div title="anchor" id={v} className={styles.anchor} />
      <h3>{children}</h3>
    </div>
  );
};

export const H4: HeadingComponent = ({ children, id }) => {
  const { id_prefix } = useContext(TimelineItemContext);
  const v = id && `${id_prefix}${id}`;
  return (
    <div className="relative">
      <div title="anchor" id={v} className={styles.anchor} />
      <h4>{children}</h4>
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

export const Code: CodeComponent = ({ inline, className, children, node }) => {
  const match = /language-(\w+)/.exec(className || '');
  const renderText = useMemo(() => children.toString().replace(/\s*\n$/, ''), [children]);
  if (inline) {
    return (
      <code className={classNames(className, styles.inlineCode, 'cursor-text')}>{renderText}</code>
    );
  }
  const language = match?.[1] || 'unknown';

  if (language === 'codepen' || language === 'codesandbox' || language === 'iframe') {
    // if `toString(node)` doesn't match iframe, return null
    const str = toString(node);
    const reg = /^<iframe[\s\S]+?<\/iframe>$/m;
    const result = str.match(reg);
    if (!result) return null;
    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={{ __html: result[0] }} />;
  }

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
      <PrismAsync
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
      </PrismAsync>
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
    queryFn: () => {
      return requestAtClient(`/public/asset/${id}`);
    },
  });
  return (
    (asset && (
      <LazyAssetImage keepAspectRatio containerClassName="mt-2" lazy={blur} asset={asset} />
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
      <img src={src} alt={alt} decoding="async" loading="lazy" />
    </span>
  );
};
