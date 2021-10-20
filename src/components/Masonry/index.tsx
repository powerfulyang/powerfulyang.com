import React, { cloneElement, FC, ReactElement, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

export type MasonryProps = {
  children: ReactElement[];
};

export const Masonry: FC<MasonryProps> = ({ children }) => {
  const [colNum, setColNum] = useState(4);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setColNum(2);
    }
  }, []);
  const arrayNodes = useMemo(() => {
    return children.reduce((draft: ReactElement[][], current, index) => {
      const i = index % colNum;
      if (draft[i]) {
        draft[i].push(current);
      } else {
        draft[i] = [current];
      }
      return draft;
    }, []);
  }, [colNum, children]);
  return (
    <div
      className={classNames('grid gap-4 mx-4', {
        'grid-cols-2': colNum === 2,
        'grid-cols-4': colNum === 4,
      })}
    >
      {arrayNodes.map((nodes, index) => {
        return (
          <div className="flex flex-col" key={String(index)}>
            {nodes.map((node) =>
              cloneElement(node, {
                className: 'mt-4 shadow-xl rounded',
              }),
            )}
          </div>
        );
      })}
    </div>
  );
};
