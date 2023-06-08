import { OrbitControls } from '@react-three/drei';
import { Canvas, useLoader, extend } from '@react-three/fiber';
import { useControls } from 'leva';
import React, { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

extend({ TextGeometry });

const HelloText = () => {
  const ref = useRef<Mesh>(null!);
  const { color, text } = useControls({ color: 'aqua', text: 'Hello' });
  const font = useLoader(FontLoader, '/typefaces/optimer_bold.typeface.json');
  const config = useMemo(() => ({ font, size: 5, height: 2 }), [font]);
  useLayoutEffect(() => {
    ref.current.geometry.center();
  }, [text]);

  return (
    <mesh ref={ref}>
      <textGeometry args={[text, config]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas
      style={{
        width: '100vw',
        height: '100vh',
      }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 20] }}
    >
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="yellow" />
      <Suspense fallback={null}>
        <HelloText />
      </Suspense>
    </Canvas>
  );
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Text3D',
        description: 'Text3D',
      },
    },
  };
};

export default App;
