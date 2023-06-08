import type * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export type BananaGLTFResult = GLTF & {
  nodes: {
    banana_high: THREE.Mesh;
    banana_mid: THREE.Mesh;
    banana_low: THREE.Mesh;
  };
  materials: {
    skin: THREE.MeshStandardMaterial;
  };
};
