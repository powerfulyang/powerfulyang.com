import type { FC } from 'react';
import React, { useContext, useMemo } from 'react';
import { Icon } from '@powerfulyang/components';
import { PrismAsyncLight } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type {
  CodeComponent,
  LiComponent,
  UnorderedListComponent,
} from 'react-markdown/lib/ast-to-react';
import classNames from 'classnames';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { MarkdownImageFromAssetManageAltConstant } from '@/constant/Constant';
import { requestAtClient } from '@/utils/client';
import styles from './index.module.scss';
import { MDContainerContext } from '@/components/MarkdownContainer/index';
import { AssetImageThumbnail } from '@/components/ImagePreview/AssetImageThumbnail';
import { copyToClipboardAndNotify } from '@/utils/copy';

export const H1: FC = ({ children }) => (
  <div className="relative">
    <div id={String(children).trim()} className={styles.anchor} />
    <h1 className="flex justify-center w-full pb-2">
      <span className={styles.heading1}>
        <span className={styles.prefix} />
        <span className={styles.content}>{children}</span>
        <span className={styles.suffix} />
      </span>
    </h1>
  </div>
);

export const H2: FC = ({ children }) => {
  return (
    <div className="relative">
      <div id={String(children).trim()} className={styles.anchor} />
      <h2 className="cursor-text">{children}</h2>
    </div>
  );
};

export const H3: FC = ({ children }) => {
  return (
    <div className="relative">
      <div id={String(children).trim()} className={styles.anchor} />
      <h3>
        <span>{children}</span>
      </h3>
    </div>
  );
};

export const H4: FC = ({ children }) => {
  return (
    <div className="relative">
      <div id={String(children).trim()} className={styles.anchor} />
      <h4 className="truncate max-w-full cursor-text" title={String(children)}>
        {children}
      </h4>
    </div>
  );
};

export const Link: FC<any> = ({ href, children }) => (
  <a rel="noreferrer" className="link" target="_blank" href={href}>
    {children}
  </a>
);

export const BlockQuote: FC = ({ children }) => (
  <blockquote className={styles.blockquote}>{children}</blockquote>
);

export const Table: FC = ({ children }) => (
  <div className="overflow-auto">
    <table className={styles.table}>{children}</table>
  </div>
);

export const Paragraph: FC<any> = ({ node, children }) => {
  const text = node.children[0].value;
  if (text?.startsWith('tags=>')) {
    const tags = text.trim().replace('tags=>', '').split('|');
    return (
      <div className="lg:ml-6 sm:ml-2 flex flex-wrap">
        {tags.map((tag: string) => (
          <motion.button
            type="button"
            key={tag}
            className="my-2 mr-2 pointer"
            onTap={() => copyToClipboardAndNotify(tag)}
          >
            <Icon type="icon-tag" className="text-xl" />
            <span className="text-[#FFB356] text-sm">{tag}</span>
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
        <span className={styles.postInfoComment} title={`author by ${author}`}>
          published at {postDate}
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
        role="presentation"
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
        PreTag="div"
        codeTagProps={{
          style: { fontFamily: `Fira Code, sans-serif`, cursor: 'text' },
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
      <AssetImageThumbnail keepAspectRatio containerClassName="mt-2" blur={blur} asset={data} />
    )) ||
    null
  );
};
export const Img = ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  if (alt === MarkdownImageFromAssetManageAltConstant && src) {
    return <AssetImage id={src} />;
  }
  // 因为开发的时候 图片没有被缓存 会出现高度突然变化的问题 导致页面闪烁
  return (
    <span className="w-full mt-2 block">
      <img src={src} alt={alt} />
    </span>
  );
};
