import type { FC } from 'react';
import { useRef } from 'react';
import classNames from 'classnames';
import { scrollIntoView } from '@powerfulyang/utils';
import styles from './index.module.scss';

export type TOCItem = {
  title: string;
  level: number;
  id: string;
};

export const MarkdownTOC: FC<{ toc: TOCItem[] }> = ({ toc }) => {
  const hashRef = useRef('');
  return (
    <div className={classNames('common-shadow hidden sm:block', styles.toc)}>
      <span className="mb-2 inline-block text-lg text-gray-400">目录:</span>
      {toc.map((item) => {
        const { id } = item;
        return (
          <div key={id} className="truncate">
            <a
              className="link px-1"
              style={{
                marginLeft: `${(item.level - 1) * 1.5}rem`,
              }}
              href={`#${id}`}
              title={item.title}
              onClick={(e) => {
                e.preventDefault();
                hashRef.current = id;
                scrollIntoView(
                  document.getElementById(id),
                  {
                    behavior: 'smooth',
                  },
                  () => {
                    window.location.hash = hashRef.current;
                  },
                );
              }}
            >
              <span className={styles.anchor}>{new Array(item.level).fill(0).map(() => '#')} </span>
              {item.title}
            </a>
          </div>
        );
      })}
    </div>
  );
};
