import type { Level1GLTFResult } from '@/three/GLTFResult';
import { a, useSpring } from '@react-spring/three';
import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect } from 'react';

export const Pyramid = () => {
  const { nodes } = useGLTF('/level1/level-react-draco.glb', '/draco/1.5.6/') as Level1GLTFResult;
  const matcap = useTexture('/textures/489B7A_A0E7D9_6DC5AC_87DAC7.png');
  const [spring, api] = useSpring(
    () => ({ rotation: [0, 0, 0], config: { mass: 5, tension: 200 } }),
    [],
  );
  useEffect(() => {
    let timeout: number;
    const rotate = () => {
      api.start({
        rotation: [(Math.random() - 0.5) * Math.PI * 3, 0, (Math.random() - 0.5) * Math.PI * 3],
      });
      timeout = window.setTimeout(rotate, (0.5 + Math.random() * 2) * 1000);
    };
    rotate();
    return () => clearTimeout(timeout);
  }, [api]);

  return (
    // @ts-ignore
    <a.mesh geometry={nodes.Pyramid.geometry} position={[-0.8, 1.33, 0.25]} {...spring}>
      <meshMatcapMaterial matcap={matcap} />
    </a.mesh>
  );
};
