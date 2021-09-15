import React, { cloneElement, FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames';

export type MasonryProps = {
  children: ReactElement[];
};

export const Masonry: FC<MasonryProps> = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [colNum, setColNum] = useState(4);
  useEffect(() => {
    if (isMobile) {
      setColNum(2);
    }
  }, [isMobile]);
  const arrayNodes = useMemo(() => {
    return children.reduce((draft: ReactElement[][], current, index) => {
      const i = index % colNum;
      if (draft[i]) {
        draft[i].push(current);
      } else {
        draft[i] = [];
      }
      return draft;
    }, []);
  }, [colNum, children]);
  return (
    <div
      className={classNames('grid gap-8 mx-8', {
        'grid-cols-2': isMobile,
        'grid-cols-4': !isMobile,
      })}
    >
      {arrayNodes.map((nodes, index) => {
        return (
          <div className="flex flex-col" key={String(index)}>
            {nodes.map((node) =>
              cloneElement(node, {
                className: 'mt-8 shadow-xl rounded',
              }),
            )}
          </div>
        );
      })}
    </div>
  );
};
