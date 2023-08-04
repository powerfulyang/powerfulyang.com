import type { FC } from 'react';
import React, { useRef } from 'react';
import classNames from 'classnames';
import { scrollIntoView } from '@powerfulyang/utils';
import { formatDateTime } from '@/utils/lib';
import type { PostLog } from '@/__generated__/api';
import styles from './index.module.scss';

export type TOCItem = {
  title: string;
  level: number;
  id: string;
};

export const MarkdownTOC: FC<{ toc: TOCItem[]; logs: PostLog[]; id: number }> = (
  { toc, logs, id: postId },
) => {
  const hashRef = useRef('');

  return (
    <div className={classNames('hidden sm:block', styles.toc)}>
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
                  document.getElementById(encodeURIComponent(id)),
                  {
                    behavior: 'smooth',
                  },
                  () => {
                    window.location.hash = `#${hashRef.current}`;
                  },
                );
              }}
            >
              <span className={styles.anchor}>{'#'.repeat(item.level)} </span>
              {item.title}
            </a>
          </div>
        );
      })}
      {logs.length > 1 && (
        <>
          <span className="mb-2 mt-4 inline-block text-lg text-gray-400">历史记录:</span>
          {logs.slice(0, -1).map((log, _index) => (
            <div key={log.id} className="truncate">
              <a
                href={`/post/diff/${postId}?versions=${log.id}&versions=${logs[_index + 1].id}`}
                target="_blank"
                rel="noreferrer"
                title={`${log.id}`}
              >
                {formatDateTime(log.createdAt)}
              </a>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
