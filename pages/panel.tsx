import { panelList } from '../src/Config/config';
import React, { useState } from 'react';
import './pannel.scss';
import { useWindowMouseWheel } from '../src/hooks/useWindowMouseWheel';
import Header from '../src/components/Header';

const Panel = () => {
  const [offset, setOffset] = useState(0);
  useWindowMouseWheel((e) => {
    const { deltaY } = e;
    setOffset((prev) => {
      return prev + deltaY > 0 && prev + deltaY;
    });
  });
  return (
    <>
      <Header title="panel" />
      <div className="content">
        <div className="panels">
          {panelList.map((item) => {
            return (
              <div
                className="contain-box"
                style={{ transform: `translateX(${-offset}px)` }}
                key={item.name}
              >
                <div className="title">
                  <a href={item.url}>{item.name}</a>
                </div>
                <div className="desc">description</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Panel;
