import type { FC } from 'react';
import { useMemo } from 'react';
import classNames from 'classnames';
import { generateToc } from '@/utils/toc';
import styles from './index.module.scss';

export const MarkdownToc: FC<{ content: string }> = ({ content }) => {
  const toc = useMemo(() => {
    return generateToc(content);
  }, [content]);
  return (
    <div className={classNames('hidden sm:block', styles.toc)}>
      <span className="mb-2 inline-block text-lg text-gray-400">目录:</span>
      {toc.map((item) => {
        const heading = item.heading.trim();
        const encodeHeading = encodeURIComponent(heading);
        return (
          <div key={item.heading} className="mt-2 truncate">
            <a
              className="link px-1"
              style={{
                marginLeft: `${item.level * 1.5}rem`,
              }}
              href={`#${encodeHeading}`}
              title={item.heading}
            >
              <span className={styles.anchor}>{new Array(item.level).fill(0).map(() => '#')} </span>
              {item.heading}
            </a>
          </div>
        );
      })}
    </div>
  );
};
