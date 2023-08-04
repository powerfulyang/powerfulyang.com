import { extend } from '@react-three/fiber';
import { GridHelper } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import FireflyMaterial from '@/shaders/FireflyMaterial';

// Create our custom element
export class CustomElement extends GridHelper {}

extend({ FireflyMaterial, CustomElement, TextGeometry });
