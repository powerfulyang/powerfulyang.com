import { extend } from '@react-three/fiber';
import { GridHelper } from 'three';
import FireflyMaterial from '@/shaders/FireflyMaterial';
import { TextGeometry } from 'three-stdlib';

// Create our custom element
export class CustomElement extends GridHelper {}

extend({ FireflyMaterial, CustomElement, TextGeometry });
