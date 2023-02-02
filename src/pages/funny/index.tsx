/* eslint-disable react/no-unknown-property */
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Fireflies } from '@/components/three/Fireflies';

const App = () => {
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

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: '有趣的玩意',
      },
    },
  };
};

export default App;
