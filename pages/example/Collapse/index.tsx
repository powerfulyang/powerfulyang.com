import { Collapse } from '@/components/Collapse';
import { useState } from 'react';

const CollapseDemo = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div onClick={() => setCollapsed((d) => !d)}>
      111
      <Collapse collapsed={collapsed}>
        abcd <br />
        abcd <br />
        abcd <br />
        abcd <br />
        abcd <br />
        abcd <br />
      </Collapse>
    </div>
  );
};

export default CollapseDemo;
