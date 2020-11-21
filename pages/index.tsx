import React, { FC } from 'react';
import { Header } from '@/components/Head';
import './index.scss';

type IndexProps = {};
export const Index: FC<IndexProps> = () => {
  return (
    <>
      <Header />
      <div className="text-center">Hello World!</div>
    </>
  );
};

export default Index;
