import React, { FC } from 'react';
import { Header } from '@/components/Head';

type IndexProps = {};
export const Index: FC<IndexProps> = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-300">Hello World!</div>
    </>
  );
};

export default Index;
