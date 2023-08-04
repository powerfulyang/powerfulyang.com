import type { FC, ReactElement } from 'react';
import React, {
  Children,
  cloneElement,
  Fragment,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';
import classNames from 'classnames';
import { useImmer, useIsomorphicLayoutEffect } from '@powerfulyang/hooks';
import { InView } from 'react-intersection-observer';
import { fromEvent } from 'rxjs';
import { ImagePreviewContext, ImagePreviewContextActionType } from '@/context/ImagePreviewContext';
import type { Asset } from '@/__generated__/api';

type MasonryItem = ReactElement<{ asset: Asset; previewIndex: number; onClick: () => void }>;

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

const getColumnNum = () => {
  return Math.ceil(window.innerWidth / 420 + 2);
};

const Masonry: FC<MasonryProps> = ({ children, onLoadMore }) => {
  const id = useId();
  const rowHeight = useRef(new Map<number, number>());
  const handled = useRef(new Set<number>());
  const [masonry, setMasonry] = useImmer(() => new Map<number, Array<MasonryItem>>());
  const paintSateRef = useRef({
    padding: 0,
    masonryWidth: 0,
  });
  const queryPaintState = useCallback(() => {
    const c = document.getElementById(id);
    if (c) {
      const computedStyle = window.getComputedStyle(c);
      const padding = parseFloat(computedStyle.getPropertyValue('grid-gap'));
      const masonryWidth = parseFloat(computedStyle.getPropertyValue('width'));
      paintSateRef.current = {
        padding,
        masonryWidth,
      };
    }
  }, [id]);

  const recalculate = useCallback(() => {
    const clientColNum = getColumnNum();
    rowHeight.current.clear();
    handled.current.clear();
    for (let i = 0; i < clientColNum; i++) {
      rowHeight.current.set(i, 0);
    }
    queryPaintState();
  }, [queryPaintState]);

  const handle = useCallback((draft: Map<number, MasonryItem[]>, child: MasonryItem) => {
    const { padding, masonryWidth } = paintSateRef.current;
    const has = handled.current.has(child.props.asset.id);
    if (!has) {
      handled.current.add(child.props.asset.id);
      const { size } = rowHeight.current;
      const width = (masonryWidth - padding * (size + 1)) / size;
      const minHeightKey = getMapValueMinKey(rowHeight.current);
      const prev = rowHeight.current.get(minHeightKey) || 0;
      const height =
        (child.props.asset.size.height / child.props.asset.size.width) * width + padding;
      rowHeight.current.set(minHeightKey, prev + height);
      if (draft.get(minHeightKey)) {
        draft.get(minHeightKey)?.push(child);
      } else {
        draft.set(minHeightKey, [child]);
      }
    }
  }, []);

  const paint = useCallback(
    (items: MasonryItem[], force?: boolean) => {
      startTransition(() => {
        setMasonry((draft) => {
          if (force) {
            draft.clear();
          }
          items.forEach((child) => handle(draft, child));
        });
      });
    },
    [handle, setMasonry],
  );

  useIsomorphicLayoutEffect(() => {
    recalculate();
  }, [recalculate]);

  useIsomorphicLayoutEffect(() => {
    paint(children);
  }, [paint, children]);

  useEffect(() => {
    const subscribe = fromEvent<UIEvent>(window, 'resize').subscribe(() => {
      const clientColNum = getColumnNum();
      if (clientColNum !== rowHeight.current.size) {
        recalculate();
        paint(children, true);
      }
    });
    return () => {
      subscribe.unsubscribe();
    };
  }, [children, masonry, paint, recalculate, setMasonry]);

  const { dispatch } = useContext(ImagePreviewContext);
  const renderedCount = useMemo(() => {
    return Array.from(masonry.values()).reduce((acc, cur) => {
      return acc + cur.length;
    }, 0);
  }, [masonry]);

  return (
    <div
      id={id}
      className={classNames('grid gap-2 px-2 sm:gap-4 sm:px-4')}
      style={{
        gridTemplateColumns: `repeat(${masonry.size}, 1fr)`,
      }}
    >
      {Array.from(masonry.keys()).map((mItem, index) => (
        <div className="my-4 flex flex-col space-y-2 sm:space-y-4" key={mItem}>
          {Children.map(masonry.get(mItem), (node, i) => {
            const isNeedLoadMore =
              index === getMapValueMinKey(rowHeight.current) &&
              i + 1 === masonry.get(mItem)?.length &&
              children.length === renderedCount; // 可能出现超长图片的情况，所以监听能看到的最短一列最好
            const onClick = () => {
              dispatch({
                type: ImagePreviewContextActionType.open,
                payload: {
                  selectIndex: node?.props.previewIndex,
                },
              });
            };
            return (
              node && (
                <Fragment key={node.props.asset.id}>
                  {cloneElement(node, {
                    onClick,
                  })}
                  {isNeedLoadMore && (
                    <InView
                      as="span"
                      triggerOnce
                      onChange={(inView) => {
                        inView && onLoadMore();
                      }}
                    />
                  )}
                </Fragment>
              )
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
