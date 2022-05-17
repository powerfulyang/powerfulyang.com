import type { FC } from 'react';
import { useRef } from 'react';
import classNames from 'classnames';
import { scrollIntoView } from '@powerfulyang/utils';
import { useHistory } from '@/hooks/useHistory';
import styles from './index.module.scss';

export type TocItem = {
  title: string;
  level: number;
  id: string;
};

export const MarkdownToc: FC<{ toc: TocItem[] }> = ({ toc }) => {
  const { replaceState } = useHistory();
  const ref = useRef('');
  return (
    <div className={classNames('hidden sm:block', styles.toc)}>
      <span className="mb-2 inline-block text-lg text-gray-400">目录:</span>
      {toc.map((item) => {
        const { id } = item;
        return (
          <div key={id} className="mt-2 truncate">
            <a
              className="link px-1"
              style={{
                marginLeft: `${item.level * 1.5}rem`,
              }}
              href={`#${id}`}
              title={item.title}
              onClick={(e) => {
                e.preventDefault();
                ref.current = `#${id}`;
                scrollIntoView(
                  document.getElementById(id),
                  {
                    behavior: 'smooth',
                  },
                  () => {
                    return replaceState(ref.current);
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
