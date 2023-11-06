import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type FireflyMaterial from '@/shaders/FireflyMaterial';
import '@/three/extend';

export const Fireflies = ({ count = 40 }) => {
  const shader = useRef<FireflyMaterial>(null!);
  const [positionArray, scaleArray] = useMemo(() => {
    const _positionArray = new Float32Array(count * 3);
    const _scaleArray = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 1.5,
        (Math.random() - 0.5) * 4,
      ).toArray(_positionArray, i * 3);
      _scaleArray[i] = Math.random();
    }
    return [_positionArray, _scaleArray];
  }, [count]);
  useFrame((_, delta) => {
    shader.current && (shader.current.time += delta / 2);
  });
  return (
    <points key={count}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positionArray}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-aScale" count={count} array={scaleArray} itemSize={1} />
      </bufferGeometry>
      <fireflyMaterial ref={shader} transparent depthWrite={false} />
    </points>
  );
};
