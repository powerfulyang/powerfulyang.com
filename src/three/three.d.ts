import type FireflyMaterial from '@/shaders/FireflyMaterial';
import type { Object3DNode } from '@react-three/fiber';
import type { CustomElement } from '@/three/extend';
import type { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

// Add types to ThreeElements elements so primitives pick up on it
declare module '@react-three/fiber' {
  interface ThreeElements {
    fireflyMaterial: Object3DNode<FireflyMaterial, typeof FireflyMaterial>;
    customElement: Object3DNode<CustomElement, typeof CustomElement>;
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}
