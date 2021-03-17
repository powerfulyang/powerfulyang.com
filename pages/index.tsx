import React, { FC } from 'react';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import styles from './index.module.scss';

const Index: FC = () => {
  return (
    <GlobalContextProvider>
      <Header />
      <figure className={styles.home_bg} />
    </GlobalContextProvider>
  );
};

export default Index;
