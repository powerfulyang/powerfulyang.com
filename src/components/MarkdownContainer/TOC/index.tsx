import type { FC } from 'react';
import React, { useMemo, useRef } from 'react';
import classNames from 'classnames';
import { scrollIntoView } from '@powerfulyang/utils';
import type { Post } from '@/type/Post';
import { DateTimeFormat } from '@/utils/lib';
import styles from './index.module.scss';

export type TOCItem = {
  title: string;
  level: number;
  id: string;
};

export const MarkdownTOC: FC<{ toc: TOCItem[]; logs: Post[]; id: number }> = ({
  toc,
  logs,
  id: postId,
}) => {
  const hashRef = useRef('');
  const reversedLogs = useMemo(() => [...logs].reverse(), [logs]);

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
                  document.getElementById(id),
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
      {reversedLogs.length > 1 && (
        <>
          <span className="mt-4 mb-2 inline-block text-lg text-gray-400">历史记录:</span>
          {reversedLogs.slice(1).map((log) => (
            <div key={log.id} className="truncate">
              <a
                href={`/post/diff/${postId}?versions=${reversedLogs[0].id}&versions=${log.id}`}
                target="_blank"
                rel="noreferrer"
                title={`${log.id}`}
              >
                {DateTimeFormat(log.createAt)}
              </a>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
