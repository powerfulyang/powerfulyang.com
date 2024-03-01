import { Suspense } from 'react';
import { Bananas } from '@/three/Bananas';

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

export const getStaticProps = () => {
  return {
    props: {
      meta: {
        title: '香蕉',
        description: '香蕉',
      },
    },
  };
};
