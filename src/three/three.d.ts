import type { Object3DNode, ThreeElements as _ThreeElements } from '@react-three/fiber';
import type { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import type FireflyMaterial from '@/shaders/FireflyMaterial';
import type { CustomElement } from '@/three/extend';

// Add types to ThreeElements elements so primitives pick up on it
declare module '@react-three/fiber' {
  export interface ThreeElements extends _ThreeElements {
    fireflyMaterial: Object3DNode<FireflyMaterial, typeof FireflyMaterial>;
    customElement: Object3DNode<CustomElement, typeof CustomElement>;
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}
