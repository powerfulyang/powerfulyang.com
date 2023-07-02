import { Canvas } from '@react-three/fiber';
import { PresentationControls } from '@react-three/drei';
import { Level } from '@/components/level1/Level';
import { Sudo } from '@/components/level1/Sudo';
import { Camera } from '@/components/level1/Camera';
import { Cactus } from '@/components/level1/Cactus';
import { Icon } from '@/components/level1/Icon';
import { Pyramid } from '@/components/level1/Pyramid';

const App = () => {
  return (
    <Canvas
      style={{
        width: '100vw',
        height: '100vh',
      }}
      flat
      dpr={[1, 2]}
      camera={{ fov: 25, position: [0, 0, 8] }}
    >
      <color attach="background" args={['#e0b7ff']} />
      <ambientLight />
      <PresentationControls
        global
        zoom={0.8}
        rotation={[0, -Math.PI / 4, 0]}
        polar={[0, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <group position-y={-0.75} dispose={null}>
          <Level />
          <Sudo />
          <Camera />
          <Cactus />
          <Icon />
          <Pyramid />
        </group>
      </PresentationControls>
    </Canvas>
  );
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Level 1',
        description: 'Level 1',
      },
    },
  };
};

export default App;
