import React from 'react';
import { Skeleton } from '@powerfulyang/components';
import { Clock } from '@/components/Clock';

const Placeholder = () => (
  <>
    <div style={{ width: '100%', height: '200px' }}>
      <Skeleton />
    </div>
    <Clock />
  </>
);

export default Placeholder;
