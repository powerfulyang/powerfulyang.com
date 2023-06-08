import type FireflyMaterial from '@/shaders/FireflyMaterial';
import type { Object3DNode } from '@react-three/fiber';
import type { CustomElement } from '@/components/three/extend';

// Add types to ThreeElements elements so primitives pick up on it
declare module '@react-three/fiber' {
  interface ThreeElements {
    fireflyMaterial: Object3DNode<FireflyMaterial, typeof FireflyMaterial>;
    customElement: Object3DNode<CustomElement, typeof CustomElement>;
  }
}
