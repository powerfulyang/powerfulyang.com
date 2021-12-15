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
    <div className={classNames('hidden-xs', styles.toc)}>
      <span className="inline-block text-gray-400 mb-2 pl-2 text-lg">目录:</span>
      {toc.map((item) => {
        return (
          <div key={item.heading}>
            <a
              className="w-full inline-block truncate"
              style={{
                paddingLeft: `${item.level * 1.5}rem`,
              }}
              href={`#${item.heading}`}
              title={item.heading}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.heading.trim())?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              <span className="pr-2 text-blue-400">
                {new Array(item.level).fill(0).map(() => '#')}
              </span>
              {item.heading}
            </a>
          </div>
        );
      })}
    </div>
  );
};
