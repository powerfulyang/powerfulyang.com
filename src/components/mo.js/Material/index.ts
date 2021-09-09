import mojs from '@mojs/core';
import { MouseEvent } from 'react';

const DURATION = 200;

// POOF

const circle = new mojs.Shape({
  left: 0,
  top: 0,
  fill: 'none',
  radius: 50,
  scale: { 0: 1 },
  opacity: { 1: 0 },
  shape: 'circle',
  stroke: '#ff6a6a',
  strokeWidth: 100,
  duration: 1.5 * DURATION,
  isShowEnd: false,
  isForce3d: true,
  isTimelineLess: true,
});

const cloud = new mojs.Burst({
  left: 0,
  top: 0,
  radius: { 4: 49 },
  angle: 45,
  count: 12,
  children: {
    radius: 10,
    fill: '#ff6a6a',
    scale: { 1: 0, easing: 'sin.in' },
    pathScale: [0.7, null],
    degreeShift: [13, null],
    duration: [500, 700],
    isShowEnd: false,
    isForce3d: true,
  },
});

const poof = new mojs.Timeline();
poof.add(circle, cloud);

export const poofClick = (e: MouseEvent) => {
  const x = e.pageX,
    y = e.pageY;

  const coords = { x, y };
  circle.tune(coords);
  cloud.tune(coords);
  poof.replay();
};
