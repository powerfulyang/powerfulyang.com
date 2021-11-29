import type { FC, ReactElement } from 'react';
import React, { cloneElement, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

export type MasonryProps = {
  children: ReactElement[];
};

export const Masonry: FC<MasonryProps> = ({ children }) => {
  const [colNum, setColNum] = useState(4);
  useEffect(() => {
    const num = Math.floor(window.innerWidth / 350);
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
      className={classNames('grid gap-4 mx-4')}
      style={{
        gridTemplateColumns: `repeat(${colNum}, 1fr)`,
      }}
    >
      {arrayNodes.map((nodes, index) => (
        <div className="flex flex-col" key={String(index)}>
          {nodes.map((node) =>
            cloneElement(node, {
              className: 'mt-4 shadow-xl rounded',
            }),
          )}
        </div>
      ))}
    </div>
  );
};
