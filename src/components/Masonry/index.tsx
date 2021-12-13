import type { FC, ReactElement } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

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
            <div key={String(i)} className="mt-2 sm:mt-4">
              {node}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
