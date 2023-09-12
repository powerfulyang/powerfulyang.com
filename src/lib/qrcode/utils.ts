import type { MarginObject } from './types';

export function resolveMargin(margin: number | MarginObject) {
  return typeof margin === 'number'
    ? {
        top: margin,
        right: margin,
        bottom: margin,
        left: margin,
      }
    : margin;
}

export function colorHexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!result) return null;
  return [
    Number.parseInt(result[1], 16),
    Number.parseInt(result[2], 16),
    Number.parseInt(result[3], 16),
  ];
}
