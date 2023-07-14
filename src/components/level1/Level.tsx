import type { Level1GLTFResult } from '@/three/GLTFResult';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useSpring } from '@react-spring/three';

export const Level = () => {
  const { nodes } = useGLTF('/level1/level-react-draco.glb', '/draco/1.5.6/') as Level1GLTFResult;
  const { camera } = useThree();
  useSpring(
    () => ({
      from: { y: camera.position.y + 5 },
      to: { y: camera.position.y },
      config: { friction: 100 },
      onChange: ({ value }) => {
        camera.position.y = value.y;
        camera.lookAt(0, 0, 0);
      },
    }),
    [],
  );
  return (
    <mesh
      geometry={nodes.Level.geometry}
      material={nodes.Level.material}
      position={[-0.38, 0.69, 0.62]}
      rotation={[Math.PI / 2, -Math.PI / 9, 0]}
    />
  );
};
