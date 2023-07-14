import type { Level1GLTFResult } from '@/three/GLTFResult';
import { a, useSpring } from '@react-spring/three';
import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect } from 'react';

export const Icon = () => {
  const { nodes } = useGLTF('/level1/level-react-draco.glb', '/draco/1.5.6/') as Level1GLTFResult;
  const matcap = useTexture('/textures/65A0C7_C3E4F8_A7D5EF_97CAE9.png');
  const [springs, api] = useSpring(() => ({
    rotation: [0.8, 1.1, -0.4],
    position: [-0.79, 1.3, 0.62],
    config: { mass: 2, tension: 200 },
  }));
  useEffect(() => {
    let timeout: number;
    let floating = false;
    const bounce = () => {
      api.start({
        rotation: [0.8 - (floating ? 0.3 : 0), 1.1, -0.4],
        position: [-0.79, floating ? 1.4 : 1.3, 0.62],
      });
      floating = !floating;
      timeout = window.setTimeout(bounce, 1.5 * 1000);
    };
    bounce();
    return () => clearTimeout(timeout);
  }, [api]);

  return (
    // @ts-ignore
    <a.mesh geometry={nodes.React.geometry} {...springs}>
      <meshMatcapMaterial matcap={matcap} />
    </a.mesh>
  );
};
