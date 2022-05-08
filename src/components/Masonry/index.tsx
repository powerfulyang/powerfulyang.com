import type { FC, ReactElement } from 'react';
import React, { Children, useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useIsomorphicLayoutEffect } from 'framer-motion';
import { ImagePreviewContext, ImagePreviewContextActionType } from '@/context/ImagePreviewContext';
import { useImmer } from '@powerfulyang/hooks';
import type { Asset } from '@/type/Asset';
import { InView } from 'react-intersection-observer';

type MasonryItem = ReactElement<{ asset: Asset; tabIndex: number }>;

const getMapValueMinKey = (items: Map<number, number>): number => {
  const minValue = Math.min(...items.values());
  for (const [key, value] of items) {
    if (value <= minValue) {
      return key;
    }
  }
  return 0;
};

export type MasonryProps = {
  children: MasonryItem[];
  onLoadMore: () => void;
};

const Masonry: FC<MasonryProps> = ({ children, onLoadMore }) => {
  const [colNum, setColNum] = useState(3);
  const rowHeight = useRef(new Map<number, number>());
  const handled = useRef(new Set<number>());
  const [masonry, setMasonry] = useImmer(() => new Map<number, Array<MasonryItem>>());
  useIsomorphicLayoutEffect(() => {
    const clientColNum = Math.ceil(window.innerWidth / 420 + 2);
    setColNum(clientColNum);
    for (let i = 0; i < clientColNum; i++) {
      setMasonry((draft) => {
        draft.set(i, []);
      });
      rowHeight.current.set(i, 0);
    }
    return () => {
      rowHeight.current.clear();
      handled.current.clear();
    };
  }, []);

  const { dispatch } = useContext(ImagePreviewContext);

  useEffect(() => {
    setMasonry((draft) => {
      children.forEach((child) => {
        const has = handled.current.has(child.props.asset.id);
        if (!has) {
          handled.current.add(child.props.asset.id);
          const minHeightKey = getMapValueMinKey(rowHeight.current);
          const prev = rowHeight.current.get(minHeightKey) || 0;
          const aspect = child.props.asset.size.height / child.props.asset.size.width;
          rowHeight.current.set(minHeightKey, prev + aspect);
          draft.get(minHeightKey)?.push(child);
        }
      });
    });
  }, [children, colNum, setMasonry]);

  return (
    <div
      className={classNames('grid gap-2 px-2 sm:gap-4 sm:px-4')}
      style={{
        gridTemplateColumns: `repeat(${colNum}, 1fr)`,
      }}
    >
      {Array.from(masonry.keys()).map((mItem, index) => (
        <div className="my-4 flex flex-col space-y-2 sm:space-y-4" key={mItem}>
          {Children.map(masonry.get(mItem), (node, i) => {
            const isNeedLoadMore =
              index === getMapValueMinKey(rowHeight.current) &&
              i + 1 === masonry.get(mItem)?.length; // 可能出现超长图片的情况，所以监听能看到的最短一列最好
            return (
              node && (
                <button
                  key={node.props.asset.id}
                  type="button"
                  onClick={() => {
                    dispatch({
                      type: ImagePreviewContextActionType.open,
                      payload: {
                        selectIndex: node.props.tabIndex,
                      },
                    });
                  }}
                >
                  {(isNeedLoadMore && (
                    <InView
                      as="span"
                      triggerOnce
                      onChange={(inView) => {
                        inView && onLoadMore();
                      }}
                      rootMargin="400px"
                    >
                      {node}
                    </InView>
                  )) ||
                    node}
                </button>
              )
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
