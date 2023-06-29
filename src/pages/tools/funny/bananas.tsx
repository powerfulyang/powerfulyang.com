import { Bananas } from '@/three/Bananas';
import React, { Suspense } from 'react';

const Index = () => {
  return (
    <Suspense fallback={null}>
      <Bananas
        style={{
          height: '100vh',
        }}
        speed={1}
      />
    </Suspense>
  );
};

export default Index;

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: '香蕉',
        description: '香蕉',
      },
    },
  };
};
