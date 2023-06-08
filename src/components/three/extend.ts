import FireflyMaterial from '@/shaders/FireflyMaterial';
import { extend } from '@react-three/fiber';
import { GridHelper } from 'three';

// Create our custom element
class CustomElement extends GridHelper {}

extend({ FireflyMaterial, CustomElement });
