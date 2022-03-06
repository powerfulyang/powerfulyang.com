import type { FC, ReactElement } from 'react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';

export type MasonryProps = {
  children: ReactElement[];
};

export const Masonry: FC<MasonryProps> = ({ children }) => {
  const [colNum, setColNum] = useState(3); // 默认是小屏幕的时候是3列
  useEffect(() => {
    const num = Math.ceil(window.innerWidth / 400 + 2);
    setColNum(num);
  }, []);
  const arrayNodes = useMemo(
    () =>
      children.reduce(
        (
          draft: {
            nodes: [
              {
                node: ReactElement;
                index: number;
              },
            ];
            index: number;
          }[],
          current,
          index,
        ) => {
          const i = index % colNum;
          if (draft[i]) {
            draft[i].nodes.push({
              node: current,
              index,
            });
          } else {
            draft[i] = {
              nodes: [
                {
                  node: current,
                  index,
                },
              ],
              index: i,
            };
          }
          return draft;
        },
        [],
      ),
    [colNum, children],
  );

  const { dispatch } = useContext(ImageModalContext);
  return (
    <div
      className={classNames('grid sm:gap-4 gap-2 sm:px-4 px-2')}
      style={{
        gridTemplateColumns: `repeat(${colNum}, 1fr)`,
      }}
    >
      {arrayNodes.map(({ nodes, index }) => (
        <div className="flex flex-col sm:space-y-4 space-y-2 my-4" key={index}>
          {nodes.map((node, i) => (
            <div
              role="presentation"
              key={node.index}
              className="rounded-lg shadow-lg overflow-hidden"
              onClick={() => {
                dispatch({
                  type: ImageModalContextActionType.open,
                  payload: {
                    selectIndex: i * colNum + index,
                  },
                });
              }}
            >
              {node.node}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
