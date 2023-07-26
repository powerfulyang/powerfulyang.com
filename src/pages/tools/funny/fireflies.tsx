import { Fireflies } from '@/three/Fireflies';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

const Index = () => {
  return (
    <Canvas
      style={{
        height: '100vh',
      }}
      dpr={[1, 2]}
      camera={{ fov: 45, position: [-4, 2, -4] }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#1e2243']} />
        <Fireflies count={50} />
      </Suspense>
    </Canvas>
  );
};

export default Index;

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: '萤火虫',
        description: '萤火虫',
      },
    },
  };
};
