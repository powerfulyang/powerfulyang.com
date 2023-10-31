import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { Fragment } from 'react';
import type { JsxRuntimeComponents } from 'react-markdown/lib';
import { clientApi } from '@/request/requestTool';
import { MarkdownImageFromAssetManageAltConstant } from '@/constant/Constant';
import { PrismCode } from '@/components/PrismCode';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import styles from './index.module.scss';

export const H1: JsxRuntimeComponents['h1'] = ({ children, id = '' }) => {
  const v = `${id}`;
  return (
    <div className="relative">
      <div title="anchor" id={encodeURIComponent(v)} className={styles.anchor} />
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

export const H2: JsxRuntimeComponents['h2'] = ({ children, id = '' }) => {
  const v = id && `${id}`;
  return (
    <div className="relative">
      <div title="anchor" id={encodeURIComponent(v)} className={styles.anchor} />
      <h2 className="cursor-text">{children}</h2>
    </div>
  );
};

export const H3: JsxRuntimeComponents['h3'] = ({ children, id = '' }) => {
  const v = id && `${id}`;
  return (
    <div className="relative">
      <div title="anchor" id={encodeURIComponent(v)} className={styles.anchor} />
      <h3>{children}</h3>
    </div>
  );
};

export const H4: JsxRuntimeComponents['h4'] = ({ children, id = '' }) => {
  const v = id && `${id}`;
  return (
    <div className="relative">
      <div title="anchor" id={encodeURIComponent(v)} className={styles.anchor} />
      <h4>{children}</h4>
    </div>
  );
};

export const A: JsxRuntimeComponents['a'] = ({ href, children }) => {
  return (
    <a rel="noreferrer" className="link" target="_blank" href={href}>
      {children}
    </a>
  );
};

export const BlockQuote: JsxRuntimeComponents['blockquote'] = ({ children }) => (
  <blockquote className={styles.blockquote}>{children}</blockquote>
);

export const Table: JsxRuntimeComponents['table'] = ({ children }) => (
  <div className="my-4 overflow-auto">
    <table className={styles.table}>{children}</table>
  </div>
);

export const Code: JsxRuntimeComponents['code'] = ({ className, children }) => {
  const match = /language-(\w+)/.exec(className || '');
  const renderText = children?.toString().replace(/\s*\n$/, '') || '';
  if (match === null) {
    return (
      <code className={classNames(className, styles.inlineCode, 'cursor-text')}>{renderText}</code>
    );
  }
  // default language is js
  const language = match?.[1] || 'js';

  return <PrismCode language={language}>{renderText}</PrismCode>;
};

export const Pre: JsxRuntimeComponents['pre'] = ({ children }) => {
  return <Fragment key="pre">{children}</Fragment>;
};

export const Ul: JsxRuntimeComponents['ul'] = ({ children, ...props }) => {
  const { className } = props;
  if (className === 'contains-task-list') {
    return <ul className={styles.containsTaskList}>{children}</ul>;
  }
  return <ul>{children}</ul>;
};

export const Li: JsxRuntimeComponents['li'] = ({ children }) => <li>{children}</li>;

const MDAssetImage: FC<{ id: string }> = ({ id }) => {
  const { data: asset } = useQuery({
    queryKey: ['md-asset-img', id],
    queryFn: async () => {
      const res = await clientApi.queryPublicAssetById(id);
      return res.data;
    },
  });
  return (
    (asset && (
      <LazyAssetImage
        thumbnail="poster"
        keepAspectRatio
        containerClassName="mt-2"
        lazy
        asset={asset}
      />
    )) ||
    null
  );
};
export const Img: JsxRuntimeComponents['img'] = ({ src, alt }) => {
  if (alt === MarkdownImageFromAssetManageAltConstant && src) {
    return <MDAssetImage id={src} />;
  }
  // 因为开发的时候 图片没有被缓存 会出现高度突然变化的问题 导致页面闪烁
  return (
    <span className="mt-2 block w-full">
      <img src={src} alt={alt} decoding="async" loading="lazy" />
    </span>
  );
};
