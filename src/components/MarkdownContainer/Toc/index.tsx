import type { FC } from 'react';
import { useMemo, useRef } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { scrollIntoView } from '@powerfulyang/utils';
import { generateToc } from '@/utils/toc';
import styles from './index.module.scss';

export const MarkdownToc: FC<{ content: string }> = ({ content }) => {
  const toc = useMemo(() => {
    return generateToc(content);
  }, [content]);
  const router = useRouter();
  const ref = useRef('');
  return (
    <div className={classNames('hidden-xs', styles.toc)}>
      <span className="inline-block text-gray-400 mb-2 text-lg">目录:</span>
      {toc.map((item) => {
        const heading = item.heading.trim();
        const encodeHeading = encodeURIComponent(heading);
        return (
          <div key={item.heading} className="mt-2 truncate">
            <a
              className="link"
              style={{
                marginLeft: `${item.level * 1.5}rem`,
              }}
              href={`#${encodeHeading}`}
              title={item.heading}
              onClick={(e) => {
                e.preventDefault();
                ref.current = `#${encodeHeading}`;
                scrollIntoView(
                  document.getElementById(heading),
                  {
                    behavior: 'smooth',
                  },
                  () => {
                    return router.replace(ref.current);
                  },
                );
              }}
            >
              <span className="text-purple-500">
                {new Array(item.level).fill(0).map(() => '#')}{' '}
              </span>
              {item.heading}
            </a>
          </div>
        );
      })}
    </div>
  );
};
