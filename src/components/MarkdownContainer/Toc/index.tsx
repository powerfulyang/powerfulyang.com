import type { FC } from 'react';
import { useMemo } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { generateToc } from '@/utils/toc';
import styles from './index.module.scss';

export const MarkdownToc: FC<{ content: string }> = ({ content }) => {
  const toc = useMemo(() => {
    return generateToc(content);
  }, [content]);
  const router = useRouter();
  return (
    <div className={classNames('hidden-xs', styles.toc)}>
      <span className="inline-block text-gray-400 mb-2 text-lg">目录:</span>
      {toc.map((item) => {
        return (
          <div key={item.heading} className="mt-2 truncate">
            <a
              className="link"
              style={{
                marginLeft: `${item.level * 1.5}rem`,
              }}
              href={`#${encodeURIComponent(item.heading.trim())}`}
              title={item.heading}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.heading.trim())?.scrollIntoView({
                  behavior: 'smooth',
                });
                setTimeout(() => {
                  return router.push(`#${encodeURIComponent(item.heading.trim())}`);
                }, 300);
              }}
            >
              <span className="text-blue-400">{new Array(item.level).fill(0).map(() => '#')} </span>
              {item.heading}
            </a>
          </div>
        );
      })}
    </div>
  );
};
