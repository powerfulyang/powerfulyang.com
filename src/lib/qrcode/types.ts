export const PixelStyles = ['square', 'rounded', 'dot', 'squircle', 'row', 'column'] as const;

export const MarkerShapes = [
  'square',
  'circle',
  'plus',
  'box',
  'octagon',
  'random',
  'tiny-plus',
] as const;
export const MarkerInnerShapes = ['square', 'circle', 'plus', 'diamond', 'eye'] as const;
export type PixelStyle = (typeof PixelStyles)[number];
export type MarkerShape = (typeof MarkerShapes)[number];
export type MarkerInnerShape = (typeof MarkerInnerShapes)[number];
export interface MarginObject {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface QrCodeGeneratorMarkerState {
  markerStyle: PixelStyle | 'auto';
  markerShape: MarkerShape;
  markerInnerShape: MarkerInnerShape | 'auto';
}

export interface QRCodeGeneratorState extends QrCodeGeneratorMarkerState {
  text: string;
  ecc: 'L' | 'M' | 'Q' | 'H';
  margin: number | MarginObject;
  scale: number;
  seed: number;
  lightColor: string;
  darkColor: string;
  maskPattern: number;
  boostECC: boolean;
  minVersion: number;
  maxVersion: number;
  pixelStyle: PixelStyle;
  markers: QrCodeGeneratorMarkerState[];
  markerSub: MarkerShape;
  marginNoise: boolean;
  marginNoiseRate: number;
  marginNoiseSpace: 'none' | 'marker' | 'full' | 'minimal' | 'extreme';
  marginNoiseOpacity: number | [number, number];
  renderPointsType: 'all' | 'data' | 'function' | 'guide' | 'marker';
  invert: boolean;
  rotate: 0 | 90 | 180 | 270;
  effect: 'none' | 'crystalize' | 'liquidify';
  effectTiming: 'before' | 'after';
  effectCrystalizeRadius: number;
  effectLiquidifyDistortRadius: number;
  effectLiquidifyRadius: number;
  effectLiquidifyThreshold: number;
  backgroundImage?: string;

  transformPerspectiveX: number;
  transformPerspectiveY: number;
  transformScale: number;
}

export interface ComparionState {
  grayscale: boolean;
  contrast: number;
  brightness: number;
  blur: number;
  grid: boolean;
  gridSize: number;
  gridMarginSize: number | MarginObject;
  gridOpacity: number;
  gridColor: string;
  overlay: boolean;
  overlayBlendMode: string;
  overlayOpacity: number;
  pixelView: boolean;
  diffThreshold: number;

  downloadType: 'correction' | 'mask';
  downloadShowImage: boolean;
  maskColor: string;
  maskShape: 'square' | 'circle';
  correctionShape: 'square' | 'circle';
  correctionOpacity: number;
  correctionBlur: number;
  correctionBlendMode: GlobalCompositeOperation | 'none';
}

export interface UploadState {
  image?: string;
  qrcode?: string;
  qrcodeWidth?: number;
  qrcodeHeight?: number;
}

export interface ScannerState {
  resize: number;
  contrast: number;
  blur: number;
  brightness: number;
  grayscale: boolean;
  locks: string[];
  cameraMirror: boolean;
  cameraViewMode: 'original' | 'processed';
  cameraSampleDelay: number;
}
export interface Segment {
  x: number;
  y: number;
  index: number;
  data: ImageData;
  hex: string;
  color: [number, number, number, number];
  luminance: number;
  value: number;
  expected: number;
  isMargin: boolean;
}
