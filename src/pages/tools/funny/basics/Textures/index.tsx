import { OrbitControls, Sphere, Stage, useTexture } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useControls } from 'leva';
import React, { Suspense } from 'react';
import * as THREE from 'three';

const Box = () => {
  const { args1 } = useControls({ args1: [1, 32, 32] });
  const textureProps = useTexture({
    map: '/texture/color.jpg',
    displacementMap: '/texture/displacement.jpg',
    metalnessMap: '/texture/metalness.jpg',
    normalMap: '/texture/normal.jpg',
    roughnessMap: '/texture/roughness.jpg',
  });
  return (
    <Sphere args={[...args1]}>
      <meshPhysicalMaterial
        {...textureProps}
        map-magFilter={THREE.NearestFilter}
        displacementScale={0.5}
      />
    </Sphere>
  );
};

const App = () => {
  return (
    <Canvas
      style={{
        width: '100vw',
        height: '100vh',
      }}
      shadows
      dpr={[1, 2]}
    >
      <OrbitControls makeDefault autoRotate />
      <Suspense fallback={null}>
        <Stage preset="rembrandt" intensity={1} environment="city">
          <Box />
        </Stage>
      </Suspense>
    </Canvas>
  );
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: '纹理',
        description: '纹理',
      },
    },
  };
};

export default App;
