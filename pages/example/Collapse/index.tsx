import React, { useState } from 'react';
import { Collapse } from '@/components/Collapse';

const CollapseDemo = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <button type="button" onClick={() => setCollapsed((d) => !d)}>
      {collapsed ? '展开' : '收起'}
      <Collapse collapsed={collapsed}>
        abcd <br />
        abcd <br />
        abcd <br />
        abcd <br />
        abcd <br />
        abcd <br />
      </Collapse>
    </button>
  );
}

export default CollapseDemo;
