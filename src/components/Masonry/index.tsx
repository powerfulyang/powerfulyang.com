import type { Asset } from '@/__generated__/api';
import { useImmer, useIsomorphicLayoutEffect } from '@powerfulyang/hooks';
import classNames from 'classnames';
import { map } from 'lodash-es';
import type { FC, ReactElement } from 'react';
import React, { Fragment, useCallback, useMemo, useRef } from 'react';
import { InView } from 'react-intersection-observer';

const getMapValueMinKey = (items: Map<number, number>): number => {
  const minValue = Math.min(...items.values());
  for (const [key, value] of items) {
    if (value <= minValue) {
      return key;
    }
  }
  return 0;
};

interface _Item extends Asset {
  previewIndex: number;
}

export type MasonryProps = {
  onLoadMore: VoidFunction;
  data: Asset[];
  itemRender: (item: Asset, index: number) => ReactElement;
};

const getColumnNum = () => {
  return Math.ceil(window.innerWidth / 420 + 2);
};

const Masonry: FC<MasonryProps> = ({ data, itemRender, onLoadMore }) => {
  const ref = useRef<HTMLDivElement>(null!);
  const rowHeight = useRef(new Map<number, number>());
  const handled = useRef(new Set<number>());
  const [masonry, setMasonry] = useImmer(() => new Map<number, Array<_Item>>());
  const paintStateRef = useRef({
    padding: 0,
    masonryWidth: 0,
  });

  const recalculate = useCallback(() => {
    const clientColNum = getColumnNum();
    rowHeight.current.clear();
    handled.current.clear();
    paintStateRef.current = {
      padding: 0,
      masonryWidth: 0,
    };

    for (let i = 0; i < clientColNum; i++) {
      rowHeight.current.set(i, 0);
    }

    const c = ref.current;
    const computedStyle = window.getComputedStyle(c);
    const padding = parseFloat(computedStyle.getPropertyValue('grid-gap'));
    const masonryWidth = parseFloat(computedStyle.getPropertyValue('width'));
    paintStateRef.current = {
      padding,
      masonryWidth,
    };
  }, []);

  const handle = useCallback((draft: Map<number, _Item[]>, child: Asset, index: number) => {
    const { padding, masonryWidth } = paintStateRef.current;

    const has = handled.current.has(child.id);
    if (!has) {
      handled.current.add(child.id);

      const { size } = rowHeight.current;
      const width = (masonryWidth - padding * (size + 1)) / size;
      const minHeightKey = getMapValueMinKey(rowHeight.current);
      const prev = rowHeight.current.get(minHeightKey) || 0;
      const height = (child.size.height / child.size.width) * width + padding;

      rowHeight.current.set(minHeightKey, prev + height);

      const currentColumn = draft.get(minHeightKey) || [];
      currentColumn.push({
        ...child,
        previewIndex: index,
      });
      draft.set(minHeightKey, currentColumn);
    }
  }, []);

  const paint = useCallback(
    (items: Asset[], force?: boolean) => {
      setMasonry((draft) => {
        if (force) {
          draft.clear();
        }
        items.forEach((child, index) => {
          handle(draft, child, index);
        });
      });
    },
    [handle, setMasonry],
  );

  useIsomorphicLayoutEffect(() => {
    // 仅在首次渲染时执行
    // 主要是获取 DOM 节点的信息
    recalculate();
  }, [recalculate]);

  useIsomorphicLayoutEffect(() => {
    // 在图片变动时执行
    paint(data);
  }, [paint, data]);

  useIsomorphicLayoutEffect(() => {
    // 在窗口变动时执行
    const handleResize = () => {
      const clientColNum = getColumnNum();
      if (clientColNum !== rowHeight.current.size) {
        recalculate();
        paint(data, true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [paint, data, recalculate]);

  const renderedCount = useMemo(() => {
    return Array.from(masonry.values()).reduce((acc, cur) => {
      return acc + cur.length;
    }, 0);
  }, [masonry]);

  return (
    <div
      ref={ref}
      className={classNames('grid gap-2 px-2 sm:gap-4 sm:px-4')}
      style={{
        gridTemplateColumns: `repeat(${masonry.size}, 1fr)`,
      }}
    >
      {Array.from(masonry.keys()).map((mItem, index) => (
        <div className="my-4 flex flex-col space-y-2 sm:space-y-4" key={mItem}>
          {map(masonry.get(mItem), (node, i) => {
            const isNeedLoadMore =
              index === getMapValueMinKey(rowHeight.current) &&
              i + 1 === masonry.get(mItem)?.length &&
              data.length === renderedCount; // 可能出现超长图片的情况，所以监听能看到的最短一列最好
            return (
              <Fragment key={node.id}>
                {itemRender(node, node.previewIndex)}
                {isNeedLoadMore && (
                  <InView
                    triggerOnce
                    onChange={(inView) => {
                      inView && onLoadMore();
                    }}
                    rootMargin="500px"
                    as="span"
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
