import type { Level1GLTFResult } from '@/three/GLTFResult';
import { MeshWobbleMaterial, useGLTF } from '@react-three/drei';

export const Cactus = () => {
  const { nodes, materials } = useGLTF(
    '/level1/level-react-draco.glb',
    '/draco/1.5.6/',
  ) as Level1GLTFResult;
  return (
    <mesh
      geometry={nodes.Cactus.geometry}
      position={[-0.42, 0.51, -0.62]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <MeshWobbleMaterial factor={0.4} map={materials.Cactus.map} />
    </mesh>
  );
};
