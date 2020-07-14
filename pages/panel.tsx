import { panelList } from '../src/Config/config';
import React from 'react';

const Panel = () => {
  return (
    // TODO 变好看点
    <div>
      {panelList.map((item) => {
        return (
          <div key={item.name}>
            <a href={item.url}>{item.name}</a>
          </div>
        );
      })}
    </div>
  );
};

export default Panel;
