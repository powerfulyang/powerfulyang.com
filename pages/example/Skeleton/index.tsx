import React from 'react';
import { Skeleton } from '@powerfulyang/components';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Header } from '@/components/Head';
import { Clock } from '@/components/Clock';

const Placeholder = () => {
  return (
    <GlobalContextProvider>
      <Header />
      <div style={{ width: '100%', height: '200px' }}>
        <Skeleton />
      </div>
      <Clock />
    </GlobalContextProvider>
  );
};

export default Placeholder;
