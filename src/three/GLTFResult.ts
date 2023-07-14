import type * as THREE from 'three';
import type { GLTF } from 'three-stdlib';

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

export type Level1GLTFResult = GLTF & {
  nodes: {
    Cactus: THREE.Mesh;
    Camera: THREE.Mesh;
    Camera_1: THREE.Mesh;
    Level: THREE.Mesh;
    Pyramid: THREE.Mesh;
    Sudo: THREE.Mesh;
    SudoHead: THREE.Mesh;
    React: THREE.Mesh;
  };
  materials: {
    Cactus: THREE.MeshBasicMaterial;
    Level: THREE.MeshBasicMaterial;
    Lens: THREE.MeshBasicMaterial;
    Pyramid: THREE.MeshBasicMaterial;
    Cube: THREE.MeshBasicMaterial;
  };
};
