import type { FC, ReactElement } from 'react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';

export type MasonryProps = {
  children: ReactElement[];
};

export const Masonry: FC<MasonryProps> = ({ children }) => {
  const [colNum, setColNum] = useState(4);
  useEffect(() => {
    const num = Math.ceil(window.innerWidth / 400 + 2);
    setColNum(num);
  }, []);
  const arrayNodes = useMemo(
    () =>
      children.reduce((draft: ReactElement[][], current, index) => {
        const i = index % colNum;
        if (draft[i]) {
          draft[i].push(current);
        } else {
          draft[i] = [current];
        }
        return draft;
      }, []),
    [colNum, children],
  );

  const { dispatch } = useContext(ImageModalContext);
  return (
    <div
      className={classNames('grid gap-2 sm:gap-4 mx-2 sm:mx-4 mb-2 sm:mb-4')}
      style={{
        gridTemplateColumns: `repeat(${colNum}, 1fr)`,
      }}
    >
      {arrayNodes.map((nodes, index) => (
        <div className="flex flex-col" key={String(index)}>
          {nodes.map((node, i) => (
            <button
              type="button"
              key={String(i)}
              className="mt-2 sm:mt-4 rounded-lg shadow-lg"
              onClick={() => {
                dispatch({
                  type: ImageModalContextActionType.open,
                  payload: {
                    selectIndex: i * colNum + index,
                  },
                });
              }}
            >
              {node}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
