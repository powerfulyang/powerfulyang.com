import type { Level1GLTFResult } from '@/types/GLTFResult';
import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';

export const Camera = () => {
  const { nodes, materials } = useGLTF(
    '/level1/level-react-draco.glb',
    '/draco/1.5.6/',
  ) as Level1GLTFResult;
  const [spring, api] = useSpring(() => ({ 'rotation-z': 0, config: { friction: 40 } }), []);

  useEffect(() => {
    let timeout: number;
    const wander = () => {
      api.start({ 'rotation-z': Math.random() });
      timeout = window.setTimeout(wander, (1 + Math.random() * 5) * 1000);
    };
    wander();
    return () => clearTimeout(timeout);
  }, [api]);

  return (
    <a.group position={[-0.58, 0.83, -0.03]} rotation={[Math.PI / 2, 0, 0.47]} {...spring}>
      <mesh geometry={nodes.Camera.geometry} material={nodes.Camera.material} />
      <mesh geometry={nodes.Camera_1.geometry} material={materials.Lens} />
    </a.group>
  );
};
