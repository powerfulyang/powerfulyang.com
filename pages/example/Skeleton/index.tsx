import React from 'react';
import { Skeleton } from '@powerfulyang/components';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Header } from '@/components/Head';

const Placeholder = () => {
  return (
    <GlobalContextProvider>
      <Header />
      <div style={{ width: '100%', height: '200px' }}>
        <Skeleton />
      </div>
    </GlobalContextProvider>
  );
};

export default Placeholder;
