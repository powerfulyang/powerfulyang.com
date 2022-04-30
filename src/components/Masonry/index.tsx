import type { FC, ReactElement } from 'react';
import React, { useContext, useMemo, useState } from 'react';
import classNames from 'classnames';
import { motion, useIsomorphicLayoutEffect } from 'framer-motion';
import { ImagePreviewContext, ImagePreviewContextActionType } from '@/context/ImagePreviewContext';

export type MasonryProps = {
  children: ReactElement[];
};

const Masonry: FC<MasonryProps> = ({ children }) => {
  const [colNum, setColNum] = useState(3);
  useIsomorphicLayoutEffect(() => {
    setColNum(Math.ceil(window.innerWidth / 420 + 2));
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

  const { dispatch } = useContext(ImagePreviewContext);

  return (
    <div
      className={classNames('grid sm:gap-4 gap-2 sm:px-4 px-2')}
      style={{
        gridTemplateColumns: `repeat(${colNum}, 1fr)`,
      }}
    >
      {arrayNodes.map(({ nodes, index }) => (
        <div className="flex flex-col sm:space-y-4 space-y-2 my-4" key={index}>
          {nodes.map((node) => (
            <motion.div
              key={node.index}
              onTap={() => {
                dispatch({
                  type: ImagePreviewContextActionType.open,
                  payload: {
                    selectIndex: node.index,
                  },
                });
              }}
            >
              {node.node}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
